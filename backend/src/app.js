const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Ruta de verificación del servidor
app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    mensaje: 'API de Gestión de Reservas de Laboratorios operativa'
  });
});

module.exports = app;