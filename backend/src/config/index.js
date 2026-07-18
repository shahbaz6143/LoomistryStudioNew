const config = {
  port: process.env.PORT || 5001,
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/loomistry-studio',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
};

module.exports = config;
