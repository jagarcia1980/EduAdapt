export interface SampleMaterial {
  id: string;
  title: string;
  type: 'html' | 'pdf';
  subject: string;
  grade: string;
  description: string;
  content: string; // HTML string or base64
  fileName: string;
}

export const SAMPLE_MATERIALS: SampleMaterial[] = [
  {
    id: 'ciencias-interactivas',
    title: 'Ficha Interactiva: Las Plantas y la Fotosíntesis',
    type: 'html',
    subject: 'Ciencias Naturales',
    grade: '4º de Primaria / 1º ESO',
    fileName: 'ciencias_plantas_interactiva.html',
    description: 'Contiene estilos CSS completos, diagrama SVG, tabla de clasificación y un cuestionario interactivo con JavaScript y botones.',
    content: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tarea de Ciencias: El Reino de las Plantas</title>
  <style>
    :root {
      --primary: #15803d;
      --primary-light: #dcfce7;
      --accent: #bbf7d0;
      --text: #1f2937;
      --bg: #f9fafb;
      --card-bg: #ffffff;
    }
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: var(--text);
      background-color: var(--bg);
      margin: 0;
      padding: 24px;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: var(--card-bg);
      padding: 32px;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      border: 1px solid #e5e7eb;
    }
    header {
      border-bottom: 3px solid var(--primary-light);
      padding-bottom: 16px;
      margin-bottom: 24px;
    }
    h1 {
      color: var(--primary);
      margin: 0 0 8px 0;
      font-size: 28px;
    }
    .badge {
      display: inline-block;
      background: var(--primary-light);
      color: var(--primary);
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 600;
    }
    .meta-box {
      display: flex;
      gap: 20px;
      margin-top: 12px;
      font-size: 14px;
      color: #6b7280;
    }
    .intro-box {
      background: #f0fdf4;
      border-left: 4px solid var(--primary);
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 24px;
    }
    .diagram-section {
      text-align: center;
      margin: 24px 0;
      padding: 20px;
      background: #f8fafc;
      border-radius: 12px;
      border: 1px dashed #cbd5e1;
    }
    svg.plant-svg {
      max-width: 280px;
      height: auto;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    th, td {
      border: 1px solid #e2e8f0;
      padding: 12px;
      text-align: left;
    }
    th {
      background: var(--primary-light);
      color: var(--primary);
      font-weight: 700;
    }
    .interactive-quiz {
      background: #fffbeb;
      border: 2px solid #fde68a;
      border-radius: 12px;
      padding: 20px;
      margin-top: 28px;
    }
    .question {
      margin-bottom: 16px;
    }
    .btn-submit {
      background: var(--primary);
      color: white;
      border: none;
      padding: 10px 24px;
      font-size: 15px;
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.2s;
    }
    .btn-submit:hover {
      background: #166534;
    }
    .result-alert {
      display: none;
      margin-top: 16px;
      padding: 12px;
      border-radius: 8px;
      font-weight: 600;
    }
    .result-alert.success {
      background: #dcfce7;
      color: #15803d;
      display: block;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <span class="badge">Unidad Didáctica 3: La Biosfera</span>
      <h1>Las Plantas y el Proceso de la Fotosíntesis</h1>
      <div class="meta-box">
        <span><strong>Asignatura:</strong> Ciencias de la Naturaleza</span>
        <span><strong>Curso:</strong> 4º de Primaria</span>
      </div>
    </header>

    <div class="intro-box">
      <h3>¿Cómo se alimentan las plantas?</h3>
      <p>A diferencia de los animales, las plantas son seres vivos capaces de fabricar su propio alimento. Este asombroso proceso biológico se llama <strong>fotosíntesis</strong>. Para realizarlo necesitan cuatro elementos fundamentales: luz del sol, agua del suelo, sales minerales y dióxido de carbono del aire.</p>
    </div>

    <div class="diagram-section">
      <h3>Esquema de las partes de una planta</h3>
      <svg class="plant-svg" viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="190" width="180" height="40" fill="#a16207" opacity="0.3" rx="4"/>
        <text x="100" y="215" text-anchor="middle" font-size="12" fill="#78350f" font-weight="bold">Suelo con agua y sales</text>
        <path d="M100 190 Q95 120 100 60" stroke="#15803d" stroke-width="8" stroke-linecap="round"/>
        <circle cx="100" cy="50" r="24" fill="#fbbf24"/>
        <circle cx="100" cy="50" r="14" fill="#b45309"/>
        <path d="M100 130 C70 120 60 90 70 80 C90 90 95 110 100 130 Z" fill="#22c55e"/>
        <path d="M100 150 C130 140 140 110 130 100 C110 110 105 130 100 150 Z" fill="#16a34a"/>
        <path d="M100 190 L85 220 M100 195 L115 225 M100 200 L98 235" stroke="#92400e" stroke-width="3" stroke-linecap="round"/>
      </svg>
      <p style="font-size: 13px; color: #4b5563;">Las raíces absorben el agua y las hojas captan la luz solar.</p>
    </div>

    <h2>Clasificación de las plantas según su tallo</h2>
    <table>
      <thead>
        <tr>
          <th>Tipo</th>
          <th>Características del tallo</th>
          <th>Ejemplo común</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Árboles</strong></td>
          <td>Tallo leñoso, duro y grueso llamado tronco. Las ramas nacen a cierta altura del suelo.</td>
          <td>Pino, Roble, Olivo</td>
        </tr>
        <tr>
          <td><strong>Arbustos</strong></td>
          <td>Tallo leñoso pero más bajo. Las ramas nacen directamente desde el suelo.</td>
          <td>Romero, Lavanda, Rosal</td>
        </tr>
        <tr>
          <td><strong>Hierbas</strong></td>
          <td>Tallo blando, verde y flexible. Crecen muy rápido y suelen tener menor altura.</td>
          <td>Trigo, Césped, Margarita</td>
        </tr>
      </tbody>
    </table>

    <div class="interactive-quiz">
      <h3>Comprueba lo aprendido (Cuestionario interactivo)</h3>
      <div class="question">
        <label><strong>1. ¿Qué gas absorben las plantas durante la fotosíntesis?</strong></label><br>
        <select id="q1" style="width: 100%; padding: 8px; margin-top: 6px; border-radius: 6px; border: 1px solid #d1d5db;">
          <option value="">-- Elige una respuesta --</option>
          <option value="oxigeno">Oxígeno</option>
          <option value="dioxido">Dióxido de carbono (CO2)</option>
          <option value="nitrogeno">Nitrógeno</option>
        </select>
      </div>

      <div class="question">
        <label><strong>2. ¿Qué parte de la planta se encarga de absorber el agua del suelo?</strong></label><br>
        <select id="q2" style="width: 100%; padding: 8px; margin-top: 6px; border-radius: 6px; border: 1px solid #d1d5db;">
          <option value="">-- Elige una respuesta --</option>
          <option value="hojas">Las hojas</option>
          <option value="flores">Las flores</option>
          <option value="raices">Las raíces</option>
        </select>
      </div>

      <button type="button" class="btn-submit" onclick="comprobarRespuestas()">Corregir ejercicio</button>
      <div id="resultado" class="result-alert"></div>
    </div>
  </div>

  <script>
    function comprobarRespuestas() {
      const q1 = document.getElementById('q1').value;
      const q2 = document.getElementById('q2').value;
      const res = document.getElementById('resultado');

      if (!q1 || !q2) {
        res.className = 'result-alert';
        res.style.display = 'block';
        res.style.background = '#fee2e2';
        res.style.color = '#b91c1c';
        res.innerText = 'Por favor, responde a todas las preguntas antes de comprobar.';
        return;
      }

      if (q1 === 'dioxido' && q2 === 'raices') {
        res.className = 'result-alert success';
        res.innerHTML = '¡Excelente trabajo! Has respondido correctamente a todas las preguntas.';
      } else {
        res.className = 'result-alert';
        res.style.display = 'block';
        res.style.background = '#fef3c7';
        res.style.color = '#92400e';
        res.innerHTML = 'Casi lo tienes. Recuerda que el dióxido de carbono es el gas del aire y las raíces absorben el agua subterránea.';
      }
    }
  </script>
</body>
</html>`
  },
  {
    id: 'ficha-actividades-primaria',
    title: 'Ficha de Actividades: Animales, Sopa de Letras y Unir con Flechas',
    type: 'pdf',
    subject: 'Lengua y Ciencias',
    grade: '3º de Primaria',
    fileName: 'ficha_ejercicios_juegos.pdf',
    description: 'Ficha impresa típica con sopa de letras (cuadrícula 10x10), unir con flechas de animales y hábitats, y tabla de clasificación.',
    content: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Ficha Escolar de Repaso: El Mundo de los Seres Vivos</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 15mm;
    }
    body {
      font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
      margin: 0;
      padding: 24px;
      color: #1e293b;
      background: #ffffff;
      line-height: 1.5;
    }
    .header-school {
      border: 2px solid #0284c7;
      border-radius: 8px;
      padding: 12px 16px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
      background: #f0f9ff;
    }
    .field {
      font-size: 14px;
      font-weight: 600;
      color: #0369a1;
    }
    .dots {
      display: inline-block;
      border-bottom: 1px dotted #64748b;
      min-width: 140px;
      height: 16px;
    }
    h1 {
      color: #0369a1;
      font-size: 22px;
      text-align: center;
      margin: 16px 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .exercise-box {
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      padding: 16px;
      margin-bottom: 20px;
      page-break-inside: avoid;
    }
    .exercise-title {
      font-size: 16px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .exercise-num {
      background: #0284c7;
      color: white;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
    }
    /* Sopa de letras */
    .wordsearch-grid {
      border-collapse: collapse;
      margin: 12px auto;
    }
    .wordsearch-grid td {
      border: 1.5px solid #94a3b8;
      width: 32px;
      height: 32px;
      text-align: center;
      font-weight: 700;
      font-size: 16px;
      color: #334155;
      background: #f8fafc;
    }
    .word-list {
      display: flex;
      justify-content: center;
      gap: 16px;
      flex-wrap: wrap;
      margin-top: 12px;
      font-weight: 600;
      color: #0369a1;
    }
    .word-pill {
      background: #e0f2fe;
      padding: 4px 12px;
      border-radius: 6px;
      border: 1px solid #bae6fd;
    }
    /* Unir con flechas */
    .matching-container {
      display: flex;
      justify-content: space-between;
      max-width: 500px;
      margin: 16px auto;
    }
    .matching-col {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .matching-item {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #f8fafc;
      padding: 8px 14px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      font-weight: 600;
      min-width: 140px;
    }
    .connector-dot {
      width: 12px;
      height: 12px;
      background: #0284c7;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 0 0 1px #0284c7;
    }
    /* Tabla */
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      margin: 12px 0;
    }
    table.data-table th, table.data-table td {
      border: 1px solid #cbd5e1;
      padding: 8px 12px;
      font-size: 14px;
    }
    table.data-table th {
      background: #f1f5f9;
      color: #0f172a;
      font-weight: 700;
    }
  </style>
</head>
<body>
  <div class="header-school">
    <div class="field">Nombre del alumno/a: <span class="dots" style="min-width: 220px;"></span></div>
    <div class="field">Fecha: <span class="dots" style="min-width: 100px;"></span></div>
    <div class="field">Curso: <span class="dots" style="min-width: 60px;"></span></div>
    <div class="field">Nota: <span class="dots" style="min-width: 40px;"></span></div>
  </div>

  <h1>Ficha de Trabajo: Seres Vivos y su Entorno</h1>

  <!-- Ejercicio 1: Sopa de letras -->
  <div class="exercise-box">
    <div class="exercise-title">
      <span class="exercise-num">1</span>
      <span>Sopa de letras: Encuentra y rodea las 5 palabras relacionadas con la naturaleza</span>
    </div>
    <p style="font-size: 13px; color: #64748b; margin-top: 0;">Las palabras pueden estar en horizontal (de izquierda a derecha) o en vertical (de arriba hacia abajo).</p>
    
    <table class="wordsearch-grid">
      <tr><td>A</td><td>G</td><td>U</td><td>A</td><td>X</td><td>T</td><td>R</td><td>O</td><td>P</td><td>L</td></tr>
      <tr><td>B</td><td>S</td><td>O</td><td>L</td><td>M</td><td>I</td><td>F</td><td>E</td><td>A</td><td>Q</td></tr>
      <tr><td>V</td><td>P</td><td>L</td><td>A</td><td>N</td><td>T</td><td>A</td><td>Z</td><td>R</td><td>W</td></tr>
      <tr><td>C</td><td>F</td><td>K</td><td>R</td><td>T</td><td>I</td><td>E</td><td>R</td><td>R</td><td>A</td></tr>
      <tr><td>D</td><td>A</td><td>I</td><td>R</td><td>E</td><td>J</td><td>Y</td><td>U</td><td>B</td><td>C</td></tr>
      <tr><td>E</td><td>U</td><td>N</td><td>H</td><td>O</td><td>J</td><td>A</td><td>I</td><td>O</td><td>M</td></tr>
      <tr><td>N</td><td>N</td><td>U</td><td>B</td><td>E</td><td>S</td><td>K</td><td>L</td><td>L</td><td>N</td></tr>
      <tr><td>F</td><td>A</td><td>U</td><td>N</td><td>A</td><td>L</td><td>U</td><td>Z</td><td>S</td><td>O</td></tr>
    </table>

    <div class="word-list">
      <span class="word-pill">AGUA</span>
      <span class="word-pill">SOL</span>
      <span class="word-pill">PLANTA</span>
      <span class="word-pill">TIERRA</span>
      <span class="word-pill">AIRE</span>
    </div>
  </div>

  <!-- Ejercicio 2: Unir con flechas -->
  <div class="exercise-box">
    <div class="exercise-title">
      <span class="exercise-num">2</span>
      <span>Une con flechas cada ser vivo con su medio o hábitat</span>
    </div>
    <div class="matching-container">
      <div class="matching-col">
        <div class="matching-item">
          <span>1. Pez Payaso</span>
          <span class="connector-dot" style="margin-left: auto;"></span>
        </div>
        <div class="matching-item">
          <span>2. Águila Real</span>
          <span class="connector-dot" style="margin-left: auto;"></span>
        </div>
        <div class="matching-item">
          <span>3. Camello</span>
          <span class="connector-dot" style="margin-left: auto;"></span>
        </div>
        <div class="matching-item">
          <span>4. Pingüino</span>
          <span class="connector-dot" style="margin-left: auto;"></span>
        </div>
      </div>

      <div class="matching-col">
        <div class="matching-item">
          <span class="connector-dot"></span>
          <span>A. Alta montaña</span>
        </div>
        <div class="matching-item">
          <span class="connector-dot"></span>
          <span>B. Arrecife de coral</span>
        </div>
        <div class="matching-item">
          <span class="connector-dot"></span>
          <span>C. Hielo de la Antártida</span>
        </div>
        <div class="matching-item">
          <span class="connector-dot"></span>
          <span>D. Desierto cálido</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Ejercicio 3: Completar la tabla -->
  <div class="exercise-box">
    <div class="exercise-title">
      <span class="exercise-num">3</span>
      <span>Completa la tabla clasificatoria de los animales vertebrados</span>
    </div>
    <table class="data-table">
      <thead>
        <tr>
          <th>Grupo</th>
          <th>¿Tienen pelo, plumas o escamas?</th>
          <th>¿Cómo respiran?</th>
          <th>Ejemplo</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Mamíferos</strong></td>
          <td>Pelo</td>
          <td>Pulmones</td>
          <td>Delfín, Perro</td>
        </tr>
        <tr>
          <td><strong>Aves</strong></td>
          <td>Plumas</td>
          <td>Pulmones</td>
          <td>Gorrión, Águila</td>
        </tr>
        <tr>
          <td><strong>Peces</strong></td>
          <td>Escamas</td>
          <td>Branquias</td>
          <td>Sardina, Trucha</td>
        </tr>
      </tbody>
    </table>
  </div>
</body>
</html>`
  },
  {
    id: 'matematicas-eso',
    title: 'Problemas Matemáticos de la Vida Cotidiana',
    type: 'html',
    subject: 'Matemáticas',
    grade: '1º ESO / 6º Primaria',
    fileName: 'problemas_matematicas_vida_cotidiana.html',
    description: 'Enunciados contextualizados con tablas de precios en euros, medidas métricas y preguntas de deducción lógica.',
    content: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Taller de Matemáticas: Resolución de Problemas Prácticos</title>
  <style>
    body {
      font-family: system-ui, sans-serif;
      margin: 0;
      padding: 24px;
      background: #f8fafc;
      color: #0f172a;
    }
    .wrapper {
      max-width: 760px;
      margin: 0 auto;
      background: white;
      padding: 28px;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
    }
    h1 {
      color: #4338ca;
      font-size: 24px;
      border-bottom: 2px solid #e0e7ff;
      padding-bottom: 12px;
    }
    .problem-card {
      background: #faf5ff;
      border-left: 4px solid #9333ea;
      padding: 18px;
      margin: 20px 0;
      border-radius: 0 8px 8px 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 14px 0;
      background: white;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 10px;
      text-align: left;
    }
    th {
      background: #f3e8ff;
      color: #6b21a8;
    }
    .input-box {
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 8px 12px;
      width: 100px;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <h1>Matemáticas: Compras en el Mercado del Barrio</h1>
    <p>Lee con atención cada problema, analiza los datos de la tabla y realiza las operaciones necesarias para responder.</p>

    <div class="problem-card">
      <h3>Problema 1: Lista de la compra para la cena escolar</h3>
      <p>María y su abuelo van al mercado municipal a comprar ingredientes para preparar una merienda colectiva. Estos son los precios por kilogramo (kg):</p>

      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio por kilogramo</th>
            <th>Cantidad comprada</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Manzanas Golden</td>
            <td>1,80 € / kg</td>
            <td>3 kg</td>
          </tr>
          <tr>
            <td>Plátanos de Canarias</td>
            <td>2,10 € / kg</td>
            <td>2 kg</td>
          </tr>
          <tr>
            <td>Naranjas de Valencia</td>
            <td>1,40 € / kg</td>
            <td>4 kg</td>
          </tr>
        </tbody>
      </table>

      <p><strong>Pregunta A:</strong> ¿Cuánto dinero cuesta en total la compra de las frutas?</p>
      <p><strong>Pregunta B:</strong> Si pagan con un billete de 20 euros, ¿cuánto dinero les devuelven de cambio?</p>
    </div>
  </div>
</body>
</html>`
  }
];

export const TARGET_LANGUAGES = [
  { code: 'uk', name: 'Ucraniano', nativeName: 'Українська', isRtl: false, flag: '🇺🇦' },
  { code: 'ar', name: 'Árabe', nativeName: 'العربية', isRtl: true, flag: '🇲🇦' },
  { code: 'fr', name: 'Francés', nativeName: 'Français', isRtl: false, flag: '🇫🇷' },
  { code: 'en', name: 'Inglés', nativeName: 'English', isRtl: false, flag: '🇬🇧' },
  { code: 'ro', name: 'Rumano', nativeName: 'Română', isRtl: false, flag: '🇷🇴' },
  { code: 'zh', name: 'Chino', nativeName: '中文', isRtl: false, flag: '🇨🇳' },
  { code: 'ru', name: 'Ruso', nativeName: 'Русский', isRtl: false, flag: '🇷🇺' },
  { code: 'pt', name: 'Portugués', nativeName: 'Português', isRtl: false, flag: '🇵🇹' },
  { code: 'de', name: 'Alemán', nativeName: 'Deutsch', isRtl: false, flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', nativeName: 'Italiano', isRtl: false, flag: '🇮🇹' },
  { code: 'wo', name: 'Wolof', nativeName: 'Wolof', isRtl: false, flag: '🇸🇳' },
];

export const PROFICIENCY_LEVELS = [
  {
    code: 'A0',
    title: 'A0 - Recién llegado / Sin español',
    badge: 'Máximo andamiaje',
    description: 'Traducción íntegra al idioma materno + términos clave en español entre paréntesis + explicaciones paso a paso ultra simplificadas.',
  },
  {
    code: 'A1',
    title: 'A1 - Principiante',
    badge: 'Traducción directa',
    description: 'Instrucciones en idioma materno con vocabulario escolar en español e iconos de apoyo visual.',
  },
  {
    code: 'A2',
    title: 'A2 - Básico / En desarrollo',
    badge: 'Apoyo bilingüe',
    description: 'Enunciados bilingües o con glosario lateral, resaltando verbos de acción y conceptos complejos.',
  },
  {
    code: 'B1',
    title: 'B1 - Transición curricular',
    badge: 'Desfase curricular',
    description: 'Material en español con aclaraciones conceptuales de desfase educativo y glosario de términos técnicos.',
  },
];
