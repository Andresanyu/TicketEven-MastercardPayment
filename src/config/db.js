const { Pool } = require('pg');
const logger = require('../utils/logger');

const pool = new Pool({
  host: process.env.MASTERCARD_DB_HOST || 'localhost',
  port: Number(process.env.MASTERCARD_DB_PORT || 5434),
  user: process.env.MASTERCARD_DB_USER || process.env.mastercard_user || 'mastercard_user',
  password: process.env.MASTERCARD_DB_PASSWORD || process.env.mastercard_pass || 'mastercard_pass',
  database: process.env.MASTERCARD_DB_NAME || process.env.mastercard_database || 'mastercard_database'
});

pool.connect()
  .then((client) => {
    logger.info('Successfully connected to Mastercard PostgreSQL database');
    client.release();
  })
  .catch((error) => {
    logger.error(`Error connecting to Mastercard PostgreSQL database: ${error.message}`);
  });

module.exports = pool;
