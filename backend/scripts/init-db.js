const fs = require('fs');
const path = require('path');
const db = require('../src/config/database');

const schemaPath = path.resolve(__dirname, '../../database/schema.sql');
const seedPath = path.resolve(__dirname, '../../database/seed.sql');

const runSqlFile = (filePath) => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(filePath)) {
      return reject(new Error(`No se encontró el archivo: ${filePath}`));
    }
    const sql = fs.readFileSync(filePath, 'utf8').trim();
    if (!sql) {
      console.log(`Archivo vacío omitido: ${path.basename(filePath)}`);
      return resolve();
    }
    db.exec(sql, (err) => {
      if (err) return reject(err);
      console.log(`Ejecutado correctamente: ${path.basename(filePath)}`);
      resolve();
    });
  });
};

(async () => {
  try {
    await runSqlFile(schemaPath);
    await runSqlFile(seedPath);
    console.log('Base de datos SQLite inicializada.');
    db.close();
  } catch (error) {
    console.error('Error inicializando la base de datos:', error.message);
    db.close();
    process.exit(1);
  }
})();