/**
 * Punto de entrada de la aplicación
 */

const app = require('./src/app');
const logger = require('./src/utils/logger');

// Puerto en el que escucha el servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Servidor de Mastercard Payment iniciado en puerto ${PORT}`);
  logger.info(`Health check: http://localhost:${PORT}/health`);
  logger.info(`Endpoint de validación: POST http://localhost:${PORT}/api/v1/mastercard/validar`);
});
