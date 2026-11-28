const express = require('express');
const router = express.Router();
const controller = require('../controllers/equipos.controller');
const { verificarToken, permitirRoles } = require('../middlewares/auth.middleware');

router.use(verificarToken, permitirRoles('A'));
router.get('/', controller.listar);
router.post('/', controller.crear);
router.put('/:id', controller.editar);
router.delete('/:id', controller.eliminar);

module.exports = router;
