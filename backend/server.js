require('dotenv').config();
const app = require('./src/app');
require('./src/config/database');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});