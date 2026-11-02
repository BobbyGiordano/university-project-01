require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 3000,
  HOST: process.env.HOST || '0.0.0.0',
  JWT_SECRET: process.env.JWT_SECRET || 'hex-titanium-secure-local-jwt-secret-2026',
  NODE_ENV: process.env.NODE_ENV || 'development',
};

