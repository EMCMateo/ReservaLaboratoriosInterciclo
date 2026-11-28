const repository = require('../repositories/laboratorios.repository');

const validar = (body) => {
  const nombre = typeof body.lab_nombre === 'string' ? body.lab_nombre.trim() : '';
  const software = typeof body.lab_software_usado === 'string' ? body.lab_software_usado.trim() : '';
  const ubicacion = Number(body.LAB_UBICACIONES_ubi_codigo);
  const capacidad = Number(body.lab_capacidad);
  const estado = body.lab_estado;
  const foto = body.lab_foto_url == null ? null : String(body.lab_foto_url).trim();
  if (!nombre || nombre.length > 150) return { error: 'lab_nombre es obligatorio y admite hasta 150 caracteres.' };
  if (!Number.isInteger(ubicacion) || ubicacion < 1) return { error: 'LAB_UBICACIONES_ubi_codigo debe ser un código válido.' };
  if (!Number.isInteger(capacidad) || capacidad < 1 || capacidad > 99) return { error: 'lab_capacidad debe ser un entero entre 1 y 99.' };
  if (!software || software.length > 100) return { error: 'lab_software_usado es obligatorio y admite hasta 100 caracteres.' };
  if (!['D', 'M'].includes(estado)) return { error: 'lab_estado debe ser D (disponible) o M (mantenimiento).' };
  return { value: { nombre, ubicacion, capacidad, software, foto: foto || null, estado } };
};

const manejarError = (res, error) => {
  if (error.code === 'SQLITE_CONSTRAINT_FOREIGNKEY' || /FOREIGN KEY constraint failed/i.test(error.message)) {
    const relacionado = /DELETE/i.test(error.message);
    return res.status(relacionado ? 409 : 400).json({
      ok: false,
      mensaje: relacionado
        ? 'No se puede eliminar: el laboratorio tiene reservas, equipos u otros registros relacionados.'
        : 'La ubicación indicada no existe.'
    });
  }
  console.error('Error en API laboratorios:', error.message);
  return res.status(500).json({ ok: false, mensaje: 'Error interno del servidor.' });
};

const listar = async (_req, res) => {
  try { return res.json({ ok: true, laboratorios: await repository.listar() }); }
  catch (error) { return manejarError(res, error); }
};

const crear = async (req, res) => {
  const resultado = validar(req.body);
  if (resultado.error) return res.status(400).json({ ok: false, mensaje: resultado.error });
  try {
    const id = await repository.crear(resultado.value);
    return res.status(201).json({ ok: true, mensaje: 'Laboratorio creado.', laboratorio: await repository.buscarPorId(id) });
  } catch (error) { return manejarError(res, error); }
};

const editar = async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) return res.status(400).json({ ok: false, mensaje: 'ID de laboratorio inválido.' });
  const resultado = validar(req.body);
  if (resultado.error) return res.status(400).json({ ok: false, mensaje: resultado.error });
  try {
    if (!await repository.buscarPorId(id)) return res.status(404).json({ ok: false, mensaje: 'Laboratorio no encontrado.' });
    await repository.editar(id, resultado.value);
    return res.json({ ok: true, mensaje: 'Laboratorio actualizado.', laboratorio: await repository.buscarPorId(id) });
  } catch (error) { return manejarError(res, error); }
};

const eliminar = async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) return res.status(400).json({ ok: false, mensaje: 'ID de laboratorio inválido.' });
  try {
    const cambios = await repository.eliminar(id);
    if (!cambios) return res.status(404).json({ ok: false, mensaje: 'Laboratorio no encontrado.' });
    return res.json({ ok: true, mensaje: 'Laboratorio eliminado.' });
  } catch (error) { return manejarError(res, error); }
};

module.exports = { listar, crear, editar, eliminar };
