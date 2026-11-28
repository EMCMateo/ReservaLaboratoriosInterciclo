const db = require('../config/database');

const selectEquipo = `SELECT e.equ_id, e.equ_codigo, e.equ_estado,
  e.LAB_TIPOS_EQUIPO_tip_codigo AS tipo_codigo, t.tip_descripcion,
  e.LAB_LABORATORIOS_lab_codigo AS lab_codigo, l.lab_nombre
  FROM LAB_EQUIPOS e
  JOIN LAB_TIPOS_EQUIPO t ON t.tip_codigo = e.LAB_TIPOS_EQUIPO_tip_codigo
  JOIN LAB_LABORATORIOS l ON l.lab_codigo = e.LAB_LABORATORIOS_lab_codigo`;

const listar = () => new Promise((resolve, reject) => {
  db.all(`${selectEquipo} ORDER BY e.equ_id`, (err, rows) => err ? reject(err) : resolve(rows));
});

const buscarPorId = (id) => new Promise((resolve, reject) => {
  db.get(`${selectEquipo} WHERE e.equ_id = ?`, [id], (err, row) => err ? reject(err) : resolve(row || null));
});

const crear = (equipo) => new Promise((resolve, reject) => {
  const sql = `INSERT INTO LAB_EQUIPOS
    (equ_codigo, equ_estado, LAB_LABORATORIOS_lab_codigo, LAB_TIPOS_EQUIPO_tip_codigo)
    VALUES (?, ?, ?, ?)`;
  db.run(sql, [equipo.codigo, equipo.estado, equipo.laboratorio, equipo.tipo], function (err) {
    if (err) return reject(err);
    resolve(this.lastID);
  });
});

const editar = (id, equipo) => new Promise((resolve, reject) => {
  const sql = `UPDATE LAB_EQUIPOS SET equ_codigo = ?, equ_estado = ?,
    LAB_LABORATORIOS_lab_codigo = ?, LAB_TIPOS_EQUIPO_tip_codigo = ? WHERE equ_id = ?`;
  db.run(sql, [equipo.codigo, equipo.estado, equipo.laboratorio, equipo.tipo, id], function (err) {
    if (err) return reject(err);
    resolve(this.changes);
  });
});

const eliminar = (id) => new Promise((resolve, reject) => {
  db.run('DELETE FROM LAB_EQUIPOS WHERE equ_id = ?', [id], function (err) {
    if (err) return reject(err);
    resolve(this.changes);
  });
});

module.exports = { listar, buscarPorId, crear, editar, eliminar };
