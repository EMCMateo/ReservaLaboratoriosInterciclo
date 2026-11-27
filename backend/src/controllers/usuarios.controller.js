const bcrypt = require('bcrypt');
const usuariosRepository = require('../repositories/usuarios.respositorry');

const ROLES_PERMITIDOS = ['D', 'E'];
const COSTO_HASH = 10;

const enviarErrorServidor = (res, operacion, error) => {
  console.error(`Error al ${operacion} usuarios:`, error.message);
  return res.status(500).json({
    ok: false,
    mensaje: 'Error interno del servidor.'
  });
};

const idValido = (id) => /^\d+$/.test(String(id)) && Number(id) > 0;

const listar = async (req, res) => {
  try {
    const rol = req.query.rol;
    if (rol !== undefined && !ROLES_PERMITIDOS.includes(rol)) {
      return res.status(400).json({
        ok: false,
        mensaje: 'El filtro rol debe ser D (Docente) o E (Estudiante).'
      });
    }

    const usuarios = await usuariosRepository.listar(rol);
    return res.status(200).json({ ok: true, usuarios });
  } catch (error) {
    return enviarErrorServidor(res, 'listar', error);
  }
};

const crear = async (req, res) => {
  try {
    const usuario = typeof req.body.usu_usuario === 'string'
      ? req.body.usu_usuario.trim()
      : '';
    const password = req.body.password;
    const rol = req.body.usu_rol;

    if (!usuario || typeof password !== 'string' || !password || !ROLES_PERMITIDOS.includes(rol)) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Envíe usu_usuario, password y usu_rol (D o E).'
      });
    }

    const hash = await bcrypt.hash(password, COSTO_HASH);
    const resultado = await usuariosRepository.crear(usuario, hash, rol);

    return res.status(201).json({
      ok: true,
      mensaje: 'Usuario creado correctamente.',
      usuario: {
        usu_codigo: resultado.id,
        usu_usuario: usuario,
        usu_rol: rol
      }
    });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT' || /UNIQUE constraint failed/i.test(error.message)) {
      return res.status(409).json({ ok: false, mensaje: 'Ese nombre de usuario ya está registrado.' });
    }
    return enviarErrorServidor(res, 'crear', error);
  }
};

const editar = async (req, res) => {
  try {
    const { id } = req.params;
    if (!idValido(id)) {
      return res.status(400).json({ ok: false, mensaje: 'El id debe ser un número entero positivo.' });
    }

    const usuario = typeof req.body.usu_usuario === 'string'
      ? req.body.usu_usuario.trim()
      : '';
    const rol = req.body.usu_rol;
    if (!usuario || !ROLES_PERMITIDOS.includes(rol)) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Envíe usu_usuario y usu_rol (D o E).'
      });
    }

    const cambiarPassword = Object.prototype.hasOwnProperty.call(req.body, 'password');
    if (cambiarPassword && (typeof req.body.password !== 'string' || !req.body.password)) {
      return res.status(400).json({ ok: false, mensaje: 'La nueva password debe ser un texto no vacío.' });
    }

    const actualizacion = await usuariosRepository.editar(Number(id), usuario, rol);
    if (!actualizacion.cambios) {
      return res.status(404).json({ ok: false, mensaje: 'No se encontró el docente o estudiante.' });
    }

    // La clave es opcional en la edición. Si se envía una nueva, solo se persiste su hash.
    if (cambiarPassword) {
      const hash = await bcrypt.hash(req.body.password, COSTO_HASH);
      await usuariosRepository.cambiarContrasena(Number(id), hash);
    }

    return res.status(200).json({
      ok: true,
      mensaje: 'Usuario actualizado correctamente.',
      usuario: { usu_codigo: Number(id), usu_usuario: usuario, usu_rol: rol }
    });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT' || /UNIQUE constraint failed/i.test(error.message)) {
      return res.status(409).json({ ok: false, mensaje: 'Ese nombre de usuario ya está registrado.' });
    }
    return enviarErrorServidor(res, 'editar', error);
  }
};

const desactivar = async (req, res) => {
  try {
    const { id } = req.params;
    if (!idValido(id)) {
      return res.status(400).json({ ok: false, mensaje: 'El id debe ser un número entero positivo.' });
    }

    const resultado = await usuariosRepository.desactivar(Number(id));
    if (!resultado.cambios) {
      return res.status(404).json({ ok: false, mensaje: 'No se encontró un usuario activo con ese id.' });
    }

    return res.status(200).json({ ok: true, mensaje: 'Usuario desactivado correctamente.' });
  } catch (error) {
    return enviarErrorServidor(res, 'desactivar', error);
  }
};

module.exports = { listar, crear, editar, desactivar };
