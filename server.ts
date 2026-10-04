import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Body parsers with generous limits for PDFs and large HTMLs
  app.use(express.json({ limit: '60mb' }));
  app.use(express.urlencoded({ limit: '60mb', extended: true }));

  // Initialize Gemini SDK with User-Agent header as required
  const apiKey = process.env.GEMINI_API_KEY || '';
  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasApiKey: Boolean(apiKey && apiKey.length > 5),
    });
  });

  // Robust HTML cleaner that extracts code from ```html blocks even if model adds intro comments
  function extractCleanHtml(rawText: string): string {
    if (!rawText) return '';
    // Look for ```html ... ``` block
    const htmlBlockMatch = rawText.match(/```html\s*([\s\S]*?)\s*```/i);
    if (htmlBlockMatch && htmlBlockMatch[1]) {
      return htmlBlockMatch[1].trim();
    }
    // Look for any ``` ... ``` block
    const codeBlockMatch = rawText.match(/```\s*([\s\S]*?)\s*```/i);
    if (codeBlockMatch && codeBlockMatch[1]) {
      return codeBlockMatch[1].trim();
    }
    // If it looks like HTML directly
    const docTypeIndex = rawText.indexOf('<!DOCTYPE');
    const htmlTagIndex = rawText.indexOf('<html');
    const firstTag = docTypeIndex !== -1 ? docTypeIndex : htmlTagIndex;
    if (firstTag !== -1) {
      const lastTag = rawText.lastIndexOf('</html>');
      if (lastTag !== -1) {
        return rawText.slice(firstTag, lastTag + 7).trim();
      }
      return rawText.slice(firstTag).trim();
    }
    return rawText.trim();
  }

  // Model fallback runner to handle temporary spikes (503 / 429) gracefully
  const FALLBACK_MODELS = [
    'gemini-2.5-flash',
    'gemini-flash-latest',
    'gemini-3.7-flash',
    'gemini-3.8-flash',
  ];

  async function generateWithFallback(params: {
    contents: any;
    systemInstruction?: string;
    temperature?: number;
  }) {
    let lastError: any = null;

    for (const model of FALLBACK_MODELS) {
      try {
        console.log(`[EduAdapt] Attempting generation with model: ${model}...`);
        const response = await ai.models.generateContent({
          model,
          contents: params.contents,
          config: {
            systemInstruction: params.systemInstruction,
            temperature: params.temperature ?? 0.2,
          },
        });

        const text = response.text || '';
        if (text && text.trim().length > 0) {
          console.log(`[EduAdapt] Successfully generated with model: ${model}`);
          return { text, modelUsed: model };
        }
      } catch (err: any) {
        console.warn(`[EduAdapt] Model ${model} encountered an issue:`, err.message || err);
        lastError = err;
        // If 503 (high demand) or 429 (rate limit), continue to next fallback model
        const errMsg = (err.message || '').toLowerCase();
        if (errMsg.includes('503') || errMsg.includes('demand') || errMsg.includes('unavailable') || errMsg.includes('429')) {
          continue;
        }
        // For other errors, also try next model before failing
        continue;
      }
    }

    throw lastError || new Error('No se pudo generar respuesta con ninguno de los modelos disponibles.');
  }

  // 1. Adapt HTML endpoint
  app.post('/api/adapt-html', async (req, res) => {
    try {
      const {
        htmlContent,
        targetLanguage = 'Ucraniano',
        targetLanguageCode = 'uk',
        level = 'A0',
        studentProfileNotes = '',
        includeGlossary = true,
        includeExplanations = true,
        isRtl = false,
      } = req.body;

      if (!htmlContent || typeof htmlContent !== 'string') {
        return res.status(400).json({ error: 'Se requiere el contenido HTML para adaptar.' });
      }

      const systemInstruction = `Eres un docente especialista de alto nivel en pedagogía inclusiva, adquisición de segundas lenguas y adaptación curricular para estudiantes no hispanohablantes o con desfase curricular e idiomático severo.

Tu misión es transformar el fichero HTML original en una versión adaptada para un alumno cuyo idioma materno o vehicular es "${targetLanguage}" (código: ${targetLanguageCode}) y cuyo nivel de competencia en español es "${level}" (según el Marco Común Europeo de Referencia o escala de integración escolar).

${studentProfileNotes ? `Detalles específicos del alumno: "${studentProfileNotes}".` : ''}

DIRECTIVAS ESTRICTAS DE PRESERVACIÓN TÉCNICA:
1. CONSERVA ÍNTEGRAMENTE toda la infraestructura técnica: la etiqueta <!DOCTYPE html>, las etiquetas <html>, <head>, <style>, <link> (a fuentes o CDNs como Tailwind, Bootstrap, MathJax, KaTeX, FontAwesome, etc.), y todas las etiquetas <script> con sus funciones, librerías, variables, eventos onclick, listeners e interactividad JavaScript.
2. NUNCA alteres nombres de variables o funciones JavaScript, ni atributos "id" o "name" que el código JS pueda requerir para funcionar.
3. CONSERVA todos los estilos CSS, clases, maquetación, paleta de colores, márgenes, bordes, imágenes, SVG e ilustraciones.

DIRECTIVAS DE TRADUCCIÓN Y ANDAMIAJE PEDAGÓGICO:
1. TRADUCE todo el texto legible para el estudiante: títulos, subtítulos, consignas de ejercicios, enunciados, párrafos explicativos, botones, etiquetas de formularios, opciones de selección, placeholders y textos generados o mostrados en la interfaz.
2. Si el nivel es A0/A1 (recién llegado / sin español):
   - Traduce completamente al idioma del alumno (${targetLanguage}).
   - Mantén entre paréntesis o en formato bilingüe los términos disciplinares o académicos clave en español (por ejemplo: "La fotosíntesis (la fotosíntesis)") para que el alumno empiece a asociar el léxico escolar en español.
3. Si el nivel es A2/B1:
   - Adapta el texto con apoyo bilingüe y redacción clara, resaltando verbos de acción ("Escribe / Écris", "Une / Relie", "Calcula / Calcule").
${includeExplanations ? `4. ACLARACIONES Y ANDAMIAJE: Añade notas breves de apoyo para conceptos difíciles, referencias culturales o desfase de conocimientos previos mediante un contenedor visualmente atractivo y amable con clase 'edu-support-note' (puedes inyectar un estilo inline o bloque con borde sutil, icono y fondo cálido).` : ''}
${includeGlossary ? `5. GLOSARIO BILINGÜE: Incluye al inicio o al final del documento un apartado destacado de vocabulario clave ('Glosario / Vocabulary') con una tabla o tarjetas limpias mostrando: Término en ${targetLanguage} | Término en español | Breve explicación o imagen/icono.` : ''}
${isRtl ? `6. DIRECCIÓN RTL: El idioma destino (${targetLanguage}) se escribe de derecha a izquierda. Añade 'dir="rtl"' a los contenedores o al <body> según corresponda para que la lectura sea perfecta.` : ''}

IMPORTANTE: Devuelve exclusivamente el código HTML íntegro dentro de un bloque \`\`\`html ... \`\`\`.`;

      const prompt = `Adapta el siguiente documento HTML original respetando escrupulosamente todo el código, estilos, scripts e imágenes, traduciendo los textos al ${targetLanguage} e incorporando los andamiajes pedagógicos solicitados:

\`\`\`html
${htmlContent}
\`\`\``;

      const result = await generateWithFallback({
        contents: prompt,
        systemInstruction,
        temperature: 0.2,
      });

      const adaptedHtml = extractCleanHtml(result.text);

      if (!adaptedHtml) {
        throw new Error('La respuesta generada no contiene código HTML válido.');
      }

      return res.json({
        adaptedHtml,
        targetLanguage,
        level,
        model: result.modelUsed,
      });
    } catch (err: any) {
      console.error('Error in /api/adapt-html:', err);
      return res.status(500).json({
        error: err.message || 'Error al procesar la adaptación del archivo HTML.',
      });
    }
  });

  // 2. Adapt PDF endpoint
  app.post('/api/adapt-pdf', async (req, res) => {
    try {
      const {
        pdfBase64,
        fileName = 'ejercicio.pdf',
        targetLanguage = 'Ucraniano',
        targetLanguageCode = 'uk',
        level = 'A0',
        studentProfileNotes = '',
        includeGlossary = true,
        includeExplanations = true,
        isRtl = false,
      } = req.body;

      if (!pdfBase64) {
        return res.status(400).json({ error: 'Se requiere el contenido del PDF en formato base64.' });
      }

      // Strip potential data URL prefix
      const cleanBase64 = pdfBase64.replace(/^data:application\/pdf;base64,/, '');

      const systemInstruction = `Eres un experto internacional en educación inclusiva, adaptación curricular y creación de materiales escolares accesibles para alumnado no hispanohablante.

Examina con máxima precisión el archivo PDF adjunto: su estructura, diseño visual, encabezados escolares (nombre, fecha, curso), apartados temáticos, tablas, diagramas, y muy especialmente los EJERCICIOS Y JUEGOS DIDÁCTICOS (como unir con flechas, sopas de letras, crucigramas, rellenar huecos, emparejar columnas, etc.).

Tu objetivo es generar un documento HTML autosuficiente, de altísima fidelidad visual y preparado para IMPRESIÓN Y DESCARGA EN PDF (formato A4) que sea la versión completamente adaptada y traducida al idioma "${targetLanguage}" con nivel "${level}".

${studentProfileNotes ? `Perfil del alumno: "${studentProfileNotes}".` : ''}

REGLAS CRÍTICAS DE ADAPTACIÓN DEL FORMATO Y EJERCICIOS:
1. REPRODUCCIÓN FIDELÍSIMA DEL FORMATO Y SECCIONES:
   - Incluye el encabezado escolar adaptado (Nombre / Date, Fecha, Curso / Grade).
   - Replica los mismos apartados, títulos, subtítulos, enunciados, tipografías y tablas.
   - Utiliza CSS moderno en una etiqueta <style> con reglas de página:
     \`@page { size: A4 portrait; margin: 12mm 15mm; } body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; color: #1e293b; }\`
2. ADAPTACIÓN DE JUEGOS Y ACTIVIDADES:
   - Si en el PDF original hay un ejercicio de UNIR CON FLECHAS o emparejar: reproduce dos columnas con cajas estilizadas y puntos de conexión (conectores con viñetas redondas o letras/números para enlazar), traduciendo los conceptos al ${targetLanguage}.
   - Si hay una SOPA DE LETRAS: ¡DEBES CREAR UNA CUADRÍCULA REAL ADAPTADA! Genera una tabla HTML (por ejemplo de 10x10 u 11x11 celdas) con letras mayúsculas cuadradas donde estén realmente ocultas en horizontal y vertical las palabras clave traducidas al ${targetLanguage}. Debajo, incluye la lista de palabras a encontrar en ${targetLanguage} con su equivalente en español entre paréntesis.
   - Si hay TABLAS: reproduce exactamente la tabla con sus filas, columnas, bordes nítidos y formato, traduciendo los encabezados y celdas.
   - Si hay espacios para rellenar o completar: mantén las líneas punteadas o recuadros de respuesta.
3. ANDAMIAJE PEDAGÓGICO:
${includeExplanations ? `   - Añade cajas de apoyo contextual ('Apoyo para el alumno / Student Help') para conceptos difíciles, unidades métricas o contexto cultural español que el alumno pueda desconocer.` : ''}
${includeGlossary ? `   - Añade un GLOSARIO BILINGÜE destacado con los términos esenciales para resolver la ficha (Término en ${targetLanguage} - Término original en español - Icono/Explicación breve).` : ''}
${isRtl ? `   - Idioma RTL: Aplica 'direction: rtl;' y text-align apropiado para ${targetLanguage}.` : ''}

4. AUTOSUFICIENCIA TÉCNICA:
   - El código HTML debe incluir todos los estilos necesarios en línea o en <style>, listos para imprimirse en tamaño A4 con salto de página limpio (\`page-break-after: always\` si tiene varias páginas).

DEVUELVE EL CÓDIGO HTML COMPLETO DENTRO DE UN BLOQUE \`\`\`html ... \`\`\`.`;

      const pdfPart = {
        inlineData: {
          mimeType: 'application/pdf',
          data: cleanBase64,
        },
      };

      const textPart = {
        text: `Analiza este documento PDF ("${fileName}") y genera la versión adaptada e imprimible en HTML lista para PDF en idioma "${targetLanguage}" (nivel "${level}"). Conserva rigurosamente el diseño, tablas y ejercicios interactivos adaptados (sopa de letras con cuadrícula real, unir con flechas, etc.).`,
      };

      const result = await generateWithFallback({
        contents: {
          parts: [pdfPart, textPart],
        },
        systemInstruction,
        temperature: 0.2,
      });

      const adaptedHtml = extractCleanHtml(result.text);

      if (!adaptedHtml) {
        throw new Error('No se pudo extraer el documento adaptado del PDF.');
      }

      return res.json({
        adaptedHtml,
        targetLanguage,
        level,
        fileName,
        model: result.modelUsed,
      });
    } catch (err: any) {
      console.error('Error in /api/adapt-pdf:', err);
      return res.status(500).json({
        error: err.message || 'Error al procesar y adaptar el archivo PDF.',
      });
    }
  });

  // 3. Regenerate with teacher feedback / observations
  app.post('/api/regenerate', async (req, res) => {
    try {
      const {
        originalType, // 'html' | 'pdf'
        originalContent, // raw HTML or pdfBase64
        currentAdaptedHtml,
        teacherFeedback,
        targetLanguage = 'Ucraniano',
        level = 'A0',
        isRtl = false,
      } = req.body;

      if (!teacherFeedback || !teacherFeedback.trim()) {
        return res.status(400).json({ error: 'Por favor, proporciona una observación o instrucción para regenerar.' });
      }

      const systemInstruction = `Eres un docente experto en diseño y adaptación de material educativo accesible para alumnos no hispanohablantes.
El profesor ha revisado la versión previa que generaste y te ha indicado una serie de observaciones, mejoras o correcciones concretas.

Tu objetivo es regenerar el documento adaptado aplicando con total precisión las observaciones del profesor, manteniendo todas las virtudes de la versión anterior (conservación de código, interactividad, maquetación, estilos, tablas, ejercicios de unir con flechas o sopa de letras).

IDIOMA DESTINO: ${targetLanguage}
NIVEL DE COMPETENCIA: ${level}
${isRtl ? 'IDIOMA RTL: Asegurar orientación de derecha a izquierda.' : ''}

DEVUELVE EL CÓDIGO HTML COMPLETO RESULTANTE DENTRO DE \`\`\`html ... \`\`\`.`;

      let contentsPayload: any;

      if (originalType === 'pdf' && originalContent && originalContent.length > 50) {
        const cleanBase64 = originalContent.replace(/^data:application\/pdf;base64,/, '');
        contentsPayload = {
          parts: [
            {
              inlineData: {
                mimeType: 'application/pdf',
                data: cleanBase64,
              },
            },
            {
              text: `DOCUMENTO PREVIAMENTE GENERADO:
\`\`\`html
${currentAdaptedHtml || ''}
\`\`\`

OBSERVACIÓN / CORRECCIÓN DEL DOCENTE:
"${teacherFeedback}"

Por favor, regenera el documento aplicando estrictamente las instrucciones del docente sin perder la maquetación ni las actividades adaptadas.`,
            },
          ],
        };
      } else {
        contentsPayload = `DOCUMENTO ORIGINAL:
\`\`\`html
${typeof originalContent === 'string' ? originalContent.slice(0, 50000) : ''}
\`\`\`

VERSIÓN ADAPTADA PREVIA:
\`\`\`html
${currentAdaptedHtml || ''}
\`\`\`

OBSERVACIONES Y CAMBIOS SOLICITADOS POR EL DOCENTE:
"${teacherFeedback}"

Por favor, regenera la versión adaptada incorporando estas observaciones, preservando todo el código, librerías, scripts, estilos y formato.`;
      }

      const result = await generateWithFallback({
        contents: contentsPayload,
        systemInstruction,
        temperature: 0.25,
      });

      const adaptedHtml = extractCleanHtml(result.text);

      if (!adaptedHtml) {
        throw new Error('No se pudo regenerar el código adaptado.');
      }

      return res.json({
        adaptedHtml,
        targetLanguage,
        level,
        model: result.modelUsed,
      });
    } catch (err: any) {
      console.error('Error in /api/regenerate:', err);
      return res.status(500).json({
        error: err.message || 'Error al regenerar el material adaptado.',
      });
    }
  });

  // Serve Vite in development or static dist in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EduAdapt fullstack server running on http://0.0.0.0:${PORT}`);
  });
}

main().catch((err) => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
