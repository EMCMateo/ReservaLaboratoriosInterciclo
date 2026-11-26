const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verificarToken, permitirRoles } = require('../middlewares/auth.middleware');

// Endpoint principal de autenticación
router.post('/login', authController.login);

// Endpoint para validar sesión activa desde Angular
router.get('/perfil', verificarToken, (req, res) => {
  res.json({
    ok: true,
    usuario: req.usuario
  });
});

// Ruta de verificación del middleware de roles (solo Administrador 'A')
router.get('/solo-admin', verificarToken, permitirRoles('A'), (req, res) => {
  res.json({
    ok: true,
    mensaje: 'Acceso autorizado para Administrador.',
    usuario: req.usuario
  });
});

module.exports = router;