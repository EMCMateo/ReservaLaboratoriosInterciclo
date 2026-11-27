const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuarios.controller');
const { verificarToken, permitirRoles } = require('../middlewares/auth.middleware');

router.use(verificarToken, permitirRoles('A'));

router.get('/', usuariosController.listar);
router.post('/', usuariosController.crear);
router.put('/:id', usuariosController.editar);
router.delete('/:id', usuariosController.desactivar);

module.exports = router;
