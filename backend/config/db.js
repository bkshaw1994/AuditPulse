const mongoose = require('mongoose');

let isMongoConnected = false;

const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/spa_seo_db';
  try {
    // Set short timeout for local fallback check
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 3000
    });
    isMongoConnected = true;
    console.log(`[Database] MongoDB Connected to ${MONGO_URI}`);
  } catch (err) {
    isMongoConnected = false;
    console.warn(`[Database] MongoDB not detected at ${MONGO_URI}. Operating in Hybrid Fallback Mode (In-Memory / File Store for seamless execution).`);
  }
};

const getMongoStatus = () => isMongoConnected;

module.exports = { connectDB, getMongoStatus };
