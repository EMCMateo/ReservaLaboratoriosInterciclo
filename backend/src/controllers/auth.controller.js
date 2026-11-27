const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authRepository = require('../repositories/auth.repository');

const login = async (req, res) => {
  try {
    const usuUsuario = (req.body.usuario || req.body.usu_usuario || '').trim();
    const password = req.body.password || '';

    if (!usuUsuario || !password) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Debe ingresar usuario y contraseña.'
      });
    }

    const usuarioEncontrado = await authRepository.buscarPorUsuario(usuUsuario);

    if (!usuarioEncontrado) {
      return res.status(401).json({
        ok: false,
        mensaje: 'Usuario o contraseña incorrectos.'
      });
    }

    const passwordValida = await bcrypt.compare(
      password,
      usuarioEncontrado.usu_contrasena
    );

    if (!passwordValida) {
      return res.status(401).json({
        ok: false,
        mensaje: 'Usuario o contraseña incorrectos.'
      });
    }

    const payload = {
      usu_codigo: usuarioEncontrado.usu_codigo,
      usu_usuario: usuarioEncontrado.usu_usuario,
      usu_rol: usuarioEncontrado.usu_rol
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    return res.status(200).json({
      ok: true,
      token,
      rol: usuarioEncontrado.usu_rol,
      usuario: payload
    });
  } catch (error) {
    console.error('Error en POST /api/auth/login:', error.message);
    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor al autenticar.'
    });
  }
};

module.exports = {
  login
};
