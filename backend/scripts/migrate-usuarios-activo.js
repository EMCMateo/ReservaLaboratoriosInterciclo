require('dotenv').config();
const db = require('../src/config/database');

db.all('PRAGMA table_info(LAB_USUARIOS)', (err, columns) => {
  if (err) {
    console.error('No se pudo revisar LAB_USUARIOS:', err.message);
    db.close();
    process.exitCode = 1;
    return;
  }

  if (columns.some((column) => column.name === 'usu_activo')) {
    console.log('La columna usu_activo ya existe.');
    db.close();
    return;
  }

  db.run(
    'ALTER TABLE LAB_USUARIOS ADD COLUMN usu_activo INTEGER NOT NULL DEFAULT 1 CHECK (usu_activo IN (0, 1))',
    (migrationError) => {
      if (migrationError) {
        console.error('No se pudo agregar usu_activo:', migrationError.message);
        process.exitCode = 1;
      } else {
        console.log('Columna usu_activo agregada; las cuentas existentes quedan activas.');
      }
      db.close();
    }
  );
});
