import * as SQLite from 'expo-sqlite';

let db = null;

export function getDb() {
  if (!db) {
    db = SQLite.openDatabaseSync('nexoclaro.db');
  }
  return db;
}

export function initDatabase() {
  const database = getDb();

  database.execSync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS perfil_usuario (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      grupo_objetivo TEXT NOT NULL DEFAULT 'general',
      idioma TEXT NOT NULL DEFAULT 'es',
      nivel_lectura TEXT NOT NULL DEFAULT 'muy_sencillo',
      texto_grande INTEGER NOT NULL DEFAULT 1,
      lectura_auto INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS servicios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      categoria TEXT NOT NULL,
      titulo TEXT NOT NULL,
      resumen_claro TEXT NOT NULL,
      requisitos TEXT NOT NULL,
      fuente_oficial TEXT
    );

    CREATE TABLE IF NOT EXISTS pasos_servicio (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      servicio_id INTEGER NOT NULL,
      orden INTEGER NOT NULL,
      instruccion TEXT NOT NULL,
      completado INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (servicio_id) REFERENCES servicios(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS consultas_ia (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      perfil_id INTEGER NOT NULL,
      pregunta TEXT NOT NULL,
      respuesta_gemini TEXT NOT NULL,
      idioma TEXT NOT NULL DEFAULT 'es',
      fecha TEXT NOT NULL,
      FOREIGN KEY (perfil_id) REFERENCES perfil_usuario(id) ON DELETE CASCADE
    );
  `);

  // Perfil inicial por defecto
  const perfilCount = database.getFirstSync('SELECT COUNT(*) as total FROM perfil_usuario;');
  if (!perfilCount || perfilCount.total === 0) {
    database.runSync(
      `INSERT INTO perfil_usuario (nombre, grupo_objetivo, idioma, nivel_lectura, texto_grande, lectura_auto)
       VALUES (?, ?, ?, ?, ?, ?);`,
      ['Usuario NexoClaro', 'adulto_mayor', 'es', 'muy_sencillo', 1, 0]
    );
  }

  // Semilla inicial de servicios reales offline
  const serviciosCount = database.getFirstSync('SELECT COUNT(*) as total FROM servicios;');
  if (!serviciosCount || serviciosCount.total === 0) {
    seedInitialServices(database);
  }
}

function seedInitialServices(database) {
  const seeds = [
    {
      categoria: 'Becas',
      titulo: 'Beca Jóvenes Escribiendo el Futuro',
      resumen_claro: 'Apoyo económico bimestral para estudiantes de universidad pública en situación vulnerable o primera generación.',
      requisitos: 'CURP, constancia de estudios vigente, estar inscrito en escuela pública prioritaria y correo personal.',
      fuente_oficial: 'subes.becasbenitojuarez.gob.mx',
      pasos: [
        'Descarga e imprime tu CURP actualizada desde gob.mx/curp.',
        'Pide en tu universidad que activen tu ficha escolar en el sistema SUBES.',
        'Crea tu cuenta en subes.becasbenitojuarez.gob.mx con tu CURP y correo.',
        'Verifica tus datos escolares, solicita la beca y guarda tu acuse con folio.',
      ],
    },
    {
      categoria: 'Becas',
      titulo: 'Beca Benito Juárez (Preparatoria)',
      resumen_claro: 'Beca universal para alumnos inscritos en preparatoria o bachillerato público.',
      requisitos: 'CURP del estudiante, comprobante de inscripción escolar y teléfono o correo de contacto.',
      fuente_oficial: 'gob.mx/becasbenitojuarez',
      pasos: [
        'Confirma en el control escolar de tu prepa que ya enviaron tu inscripción.',
        'Ingresa al Buscador de Estatus con tu CURP en buscador.becasbenitojuarez.gob.mx.',
        'Revisa la fecha y sucursal del Banco del Bienestar para recoger tu tarjeta.',
      ],
    },
    {
      categoria: 'Trámites',
      titulo: 'Pensión Bienestar (Adultos Mayores 65+)',
      resumen_claro: 'Apoyo económico bimestral universal para personas de 65 años o más en México.',
      requisitos: 'Identificación oficial (INE o INAPAM), Acta de nacimiento, CURP reciente y comprobante de domicilio.',
      fuente_oficial: 'gob.mx/bienestar',
      pasos: [
        'Reúne copias claras de tu INE, Acta de nacimiento, CURP y recibo de luz o agua.',
        'Ubica el Módulo del Bienestar más cercano en ubicatumodulo.bienestar.gob.mx.',
        'Acude en la fecha que corresponde a la primera letra de tu apellido.',
        'Guarda tu talón verde de registro para recoger tu tarjeta.',
      ],
    },
    {
      categoria: 'Trámites',
      titulo: 'Obtener o corregir tu CURP gratis',
      resumen_claro: 'Trámite gratuito para descargar tu Clave Única de Registro de Población desde tu celular.',
      requisitos: 'Nombre completo, fecha y estado de nacimiento (o acta de nacimiento si requiere corrección).',
      fuente_oficial: 'gob.mx/curp',
      pasos: [
        'Entra a la página oficial gob.mx/curp desde cualquier navegador.',
        'Elige "Datos Personales" y escribe tu nombre, fecha y lugar de nacimiento.',
        'Presiona Buscar y toca "Descargar PDF" para guardarla en tu teléfono.',
      ],
    },
    {
      categoria: 'Salud',
      titulo: 'Registro gratuito en IMSS-Bienestar',
      resumen_claro: 'Atención médica, consultas y medicamentos gratuitos para personas sin seguridad social.',
      requisitos: 'CURP, identificación oficial, correo electrónico o número de celular y fotografía.',
      fuente_oficial: 'registro.imssbienestar.gob.mx',
      pasos: [
        'Entra a registro.imssbienestar.gob.mx desde tu celular o computadora.',
        'Escribe tu CURP y tu código postal para validar tu clínica más cercana.',
        'Completa tus datos de contacto y descarga tu comprobante de registro.',
        'Acude a tu centro de salud asignado con tu comprobante y tu INE.',
      ],
    },
    {
      categoria: 'Empleo',
      titulo: 'Jóvenes Construyendo el Futuro',
      resumen_claro: 'Capacitación laboral pagada durante 12 meses para jóvenes de 18 a 29 años que no estudian ni trabajan.',
      requisitos: 'Tener entre 18 y 29 años, INE, CURP, comprobante de domicilio y no estar estudiando ni trabajando.',
      fuente_oficial: 'jovenesconstruyendoelfuturo.stps.gob.mx',
      pasos: [
        'Regístrate en jovenesconstruyendoelfuturo.stps.gob.mx como Aprendiz.',
        'Sube tu identificación, CURP y comprobante de domicilio vigentes.',
        'Elige un centro de trabajo cercano a tu domicilio para capacitarte.',
        'Asiste a tu entrevista inicial y confirma tu fecha de inicio.',
      ],
    },
  ];

  for (const item of seeds) {
    const res = database.runSync(
      `INSERT INTO servicios (categoria, titulo, resumen_claro, requisitos, fuente_oficial)
       VALUES (?, ?, ?, ?, ?);`,
      [item.categoria, item.titulo, item.resumen_claro, item.requisitos, item.fuente_oficial]
    );
    const servicioId = res.lastInsertRowId;
    item.pasos.forEach((instruccion, idx) => {
      database.runSync(
        `INSERT INTO pasos_servicio (servicio_id, orden, instruccion, completado)
         VALUES (?, ?, ?, 0);`,
        [servicioId, idx + 1, instruccion]
      );
    });
  }
}

export function getPerfil() {
  const database = getDb();
  return database.getFirstSync('SELECT * FROM perfil_usuario ORDER BY id ASC LIMIT 1;');
}

export function savePerfil({ id, nombre, grupo_objetivo, idioma, nivel_lectura, texto_grande, lectura_auto }) {
  const database = getDb();
  database.runSync(
    `UPDATE perfil_usuario
     SET nombre = ?, grupo_objetivo = ?, idioma = ?, nivel_lectura = ?, texto_grande = ?, lectura_auto = ?
     WHERE id = ?;`,
    [nombre, grupo_objetivo, idioma, nivel_lectura, texto_grande ? 1 : 0, lectura_auto ? 1 : 0, id]
  );
  return getPerfil();
}

export function getServiciosWithProgress(categoria = null) {
  const database = getDb();
  const where = categoria && categoria !== 'Todas' ? 'WHERE s.categoria = ?' : '';
  const params = categoria && categoria !== 'Todas' ? [categoria] : [];
  return database.getAllSync(
    `SELECT s.*,
            COUNT(p.id) as total_pasos,
            COALESCE(SUM(p.completado), 0) as pasos_completados
     FROM servicios s
     LEFT JOIN pasos_servicio p ON p.servicio_id = s.id
     ${where}
     GROUP BY s.id
     ORDER BY s.id DESC;`,
    params
  );
}

export function getPasosByServicio(servicioId) {
  const database = getDb();
  return database.getAllSync(
    'SELECT * FROM pasos_servicio WHERE servicio_id = ? ORDER BY orden ASC;',
    [servicioId]
  );
}

export function togglePasoCompletado(pasoId, currentVal) {
  const database = getDb();
  const nextVal = currentVal ? 0 : 1;
  database.runSync('UPDATE pasos_servicio SET completado = ? WHERE id = ?;', [nextVal, pasoId]);
  return nextVal;
}

export function saveCustomGuide({ categoria, titulo, resumen_claro, pasos }) {
  const database = getDb();
  const res = database.runSync(
    `INSERT INTO servicios (categoria, titulo, resumen_claro, requisitos, fuente_oficial)
     VALUES (?, ?, ?, ?, ?);`,
    [categoria || 'Trámites', titulo, resumen_claro, 'Generado por Asistente NexoClaro (IA)', 'Guía Personalizada Offline']
  );
  const servicioId = res.lastInsertRowId;
  pasos.forEach((instruccion, idx) => {
    database.runSync(
      `INSERT INTO pasos_servicio (servicio_id, orden, instruccion, completado)
       VALUES (?, ?, ?, 0);`,
      [servicioId, idx + 1, instruccion]
    );
  });
  return servicioId;
}

export function saveConsultaIA(perfilId, pregunta, respuestaGemini, idioma) {
  const database = getDb();
  database.runSync(
    `INSERT INTO consultas_ia (perfil_id, pregunta, respuesta_gemini, idioma, fecha)
     VALUES (?, ?, ?, ?, ?);`,
    [perfilId, pregunta, respuestaGemini, idioma, new Date().toISOString()]
  );
}

export function getConsultasRecientes(limit = 15) {
  const database = getDb();
  return database.getAllSync(
    'SELECT * FROM consultas_ia ORDER BY id DESC LIMIT ?;',
    [limit]
  );
}
