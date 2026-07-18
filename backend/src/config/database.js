const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/loomistry-studio';

  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.warn('⚠️  MongoDB not available — server will start without database.');
    console.warn('   Set MONGODB_URI in .env to connect to MongoDB Atlas or a local instance.');
  }

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected');
  });
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  console.log('MongoDB disconnected');
};

module.exports = { connectDB, disconnectDB };
