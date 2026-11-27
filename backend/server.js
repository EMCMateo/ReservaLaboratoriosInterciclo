require('dotenv').config();
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET debe estar definido y tener al menos 32 caracteres.');
}
const app = require('./src/app');
require('./src/config/database');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});
