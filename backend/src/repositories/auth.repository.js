const db = require('../config/database');

const buscarPorUsuario = (usuUsuario) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        usu_codigo,
        usu_usuario,
        "usu_contraseña" AS usu_contrasena,
        usu_rol
      FROM LAB_USUARIOS
      WHERE usu_usuario = ?
        AND usu_activo = 1
    `;

    db.get(sql, [usuUsuario], (err, row) => {
      if (err) return reject(err);
      resolve(row || null);
    });
  });
};

module.exports = {
  buscarPorUsuario
};
