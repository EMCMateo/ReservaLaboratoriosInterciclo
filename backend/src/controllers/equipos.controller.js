const repository = require('../repositories/equipos.repository');
const ESTADOS = ['O', 'D', 'R'];

const validar = (body) => {
  const codigo = Number(body.equ_codigo);
  const laboratorio = Number(body.LAB_LABORATORIOS_lab_codigo);
  const tipo = Number(body.LAB_TIPOS_EQUIPO_tip_codigo);
  const estado = body.equ_estado;
  if (!Number.isInteger(codigo) || codigo < 1 || codigo > 9999) return { error: 'equ_codigo debe ser un entero entre 1 y 9999.' };
  if (!Number.isInteger(tipo) || tipo < 1) return { error: 'LAB_TIPOS_EQUIPO_tip_codigo debe ser un código válido.' };
  if (!Number.isInteger(laboratorio) || laboratorio < 1) return { error: 'LAB_LABORATORIOS_lab_codigo debe ser un código válido.' };
  if (!ESTADOS.includes(estado)) return { error: 'equ_estado debe ser O (operativo), D (dañado) o R (en reparación).' };
  return { value: { codigo, tipo, laboratorio, estado } };
};

const manejarError = (res, error, operacion) => {
  if (error.code === 'SQLITE_CONSTRAINT_UNIQUE' || /UNIQUE constraint failed/i.test(error.message)) {
    return res.status(409).json({ ok: false, mensaje: 'Ese código de equipo ya está registrado.' });
  }
  if (error.code === 'SQLITE_CONSTRAINT_FOREIGNKEY' || /FOREIGN KEY constraint failed/i.test(error.message)) {
    const eliminando = operacion === 'eliminar';
    return res.status(eliminando ? 409 : 400).json({
      ok: false,
      mensaje: eliminando
        ? 'No se puede eliminar: el equipo tiene incidencias o reservas relacionadas.'
        : 'El tipo de equipo o el laboratorio indicado no existe.'
    });
  }
  console.error(`Error al ${operacion} equipos:`, error.message);
  return res.status(500).json({ ok: false, mensaje: 'Error interno del servidor.' });
};

const listar = async (_req, res) => {
  try { return res.json({ ok: true, equipos: await repository.listar() }); }
  catch (error) { return manejarError(res, error, 'listar'); }
};

const crear = async (req, res) => {
  const result = validar(req.body);
  if (result.error) return res.status(400).json({ ok: false, mensaje: result.error });
  try {
    const id = await repository.crear(result.value);
    return res.status(201).json({ ok: true, mensaje: 'Equipo creado.', equipo: await repository.buscarPorId(id) });
  } catch (error) { return manejarError(res, error, 'crear'); }
};

const editar = async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) return res.status(400).json({ ok: false, mensaje: 'ID de equipo inválido.' });
  const result = validar(req.body);
  if (result.error) return res.status(400).json({ ok: false, mensaje: result.error });
  try {
    if (!await repository.buscarPorId(id)) return res.status(404).json({ ok: false, mensaje: 'Equipo no encontrado.' });
    await repository.editar(id, result.value);
    return res.json({ ok: true, mensaje: 'Equipo actualizado.', equipo: await repository.buscarPorId(id) });
  } catch (error) { return manejarError(res, error, 'editar'); }
};

const eliminar = async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) return res.status(400).json({ ok: false, mensaje: 'ID de equipo inválido.' });
  try {
    const cambios = await repository.eliminar(id);
    if (!cambios) return res.status(404).json({ ok: false, mensaje: 'Equipo no encontrado.' });
    return res.json({ ok: true, mensaje: 'Equipo eliminado.' });
  } catch (error) { return manejarError(res, error, 'eliminar'); }
};

module.exports = { listar, crear, editar, eliminar };
