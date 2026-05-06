/**
 * Configuración principal de la aplicación Express
 */

const express = require('express');
const cors = require('cors');
const mastercardRoutes = require('./routes/mastercardRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Servidor de pagos de Mastercard está operativo'
  });
});

// Rutas
app.use('/api/v1/mastercard', mastercardRoutes);

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    mensaje: "Ruta no encontrada"
  });
});

module.exports = app;
