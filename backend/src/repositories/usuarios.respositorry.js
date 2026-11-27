const db = require('../config/database');

const listar = (rol) => {
  return new Promise((resolve, reject) => {
    let sql = `
      SELECT usu_codigo, usu_usuario, usu_rol
      FROM LAB_USUARIOS
      WHERE usu_rol IN ('D', 'E')
        AND usu_activo = 1
    `;
    const params = [];

    if (rol) {
      sql += ' AND usu_rol = ?';
      params.push(rol);
    }

    sql += ' ORDER BY usu_codigo';

    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

const buscarPorId = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT usu_codigo, usu_usuario, usu_rol
      FROM LAB_USUARIOS
      WHERE usu_codigo = ?
        AND usu_rol IN ('D', 'E')
        AND usu_activo = 1
    `;

    db.get(sql, [id], (err, row) => {
      if (err) return reject(err);
      resolve(row || null);
    });
  });
};

const crear = (usuario, hash, rol) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO LAB_USUARIOS (usu_usuario, "usu_contraseña", usu_rol)
      VALUES (?, ?, ?)
    `;

    db.run(sql, [usuario, hash, rol], function (err) {
      if (err) return reject(err);
      resolve({ id: this.lastID });
    });
  });
};

const editar = (id, usuario, rol) => {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE LAB_USUARIOS
      SET usu_usuario = ?, usu_rol = ?
      WHERE usu_codigo = ?
        AND usu_rol IN ('D', 'E')
        AND usu_activo = 1
    `;

    db.run(sql, [usuario, rol, id], function (err) {
      if (err) return reject(err);
      resolve({ cambios: this.changes });
    });
  });
};

const cambiarContrasena = (id, hash) => {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE LAB_USUARIOS
      SET "usu_contraseña" = ?
      WHERE usu_codigo = ?
        AND usu_rol IN ('D', 'E')
        AND usu_activo = 1
    `;

    db.run(sql, [hash, id], function (err) {
      if (err) return reject(err);
      resolve({ cambios: this.changes });
    });
  });
};

const desactivar = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE LAB_USUARIOS
      SET usu_activo = 0
      WHERE usu_codigo = ?
        AND usu_rol IN ('D', 'E')
        AND usu_activo = 1
    `;

    db.run(sql, [id], function (err) {
      if (err) return reject(err);
      resolve({ cambios: this.changes });
    });
  });
};

module.exports = {
  listar,
  buscarPorId,
  crear,
  editar,
  cambiarContrasena,
  desactivar
};
