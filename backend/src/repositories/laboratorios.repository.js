const db = require('../config/database');

const columnas = `l.lab_codigo, l.lab_nombre, l.LAB_UBICACIONES_ubi_codigo,
  u.ubi_edificio, u.ubi_piso, l.lab_capacidad, l.lab_software_usado,
  l.lab_foto_url, l.lab_estado`;

const listar = () => new Promise((resolve, reject) => {
  db.all(`SELECT ${columnas} FROM LAB_LABORATORIOS l
    JOIN LAB_UBICACIONES u ON u.ubi_codigo = l.LAB_UBICACIONES_ubi_codigo
    ORDER BY l.lab_codigo`, (err, rows) => err ? reject(err) : resolve(rows));
});

const buscarPorId = (id) => new Promise((resolve, reject) => {
  db.get(`SELECT ${columnas} FROM LAB_LABORATORIOS l
    JOIN LAB_UBICACIONES u ON u.ubi_codigo = l.LAB_UBICACIONES_ubi_codigo
    WHERE l.lab_codigo = ?`, [id], (err, row) => err ? reject(err) : resolve(row || null));
});

const crear = (lab) => new Promise((resolve, reject) => {
  const sql = `INSERT INTO LAB_LABORATORIOS
    (lab_nombre, LAB_UBICACIONES_ubi_codigo, lab_capacidad, lab_software_usado, lab_foto_url, lab_estado)
    VALUES (?, ?, ?, ?, ?, ?)`;
  db.run(sql, [lab.nombre, lab.ubicacion, lab.capacidad, lab.software, lab.foto, lab.estado], function (err) {
    if (err) return reject(err);
    resolve(this.lastID);
  });
});

const editar = (id, lab) => new Promise((resolve, reject) => {
  const sql = `UPDATE LAB_LABORATORIOS SET lab_nombre = ?, LAB_UBICACIONES_ubi_codigo = ?,
    lab_capacidad = ?, lab_software_usado = ?, lab_foto_url = ?, lab_estado = ? WHERE lab_codigo = ?`;
  db.run(sql, [lab.nombre, lab.ubicacion, lab.capacidad, lab.software, lab.foto, lab.estado, id], function (err) {
    if (err) return reject(err);
    resolve(this.changes);
  });
});

const eliminar = (id) => new Promise((resolve, reject) => {
  db.run('DELETE FROM LAB_LABORATORIOS WHERE lab_codigo = ?', [id], function (err) {
    if (err) return reject(err);
    resolve(this.changes);
  });
});

module.exports = { listar, buscarPorId, crear, editar, eliminar };
