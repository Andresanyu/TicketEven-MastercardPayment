/**
 * Punto de entrada de la aplicación
 */

const app = require('./src/app');

// Puerto en el que escucha el servidor
const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`✅ Servidor de Mastercard Payment iniciado en puerto ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 Endpoint de validación: POST http://localhost:${PORT}/api/v1/mastercard/validar`);
});
