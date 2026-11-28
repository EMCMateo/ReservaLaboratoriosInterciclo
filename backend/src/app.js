const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const laboratoriosRoutes = require('./routes/laboratorios.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    mensaje: 'API de Gestión de Reservas de Laboratorios operativa'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/laboratorios', laboratoriosRoutes);

module.exports = app; 
