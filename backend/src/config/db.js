const mongoose = require('mongoose');
const { Pool } = require('pg');
require('dotenv').config();

// PostgreSQL Connection Pool
const pgPool = new Pool({
  connectionString: process.env.PG_URI || 'postgres://postgres:postgres@localhost:5432/ciphersql_sandbox',
});

// Database Connection Function
const connectDB = async () => {
  try {
    // 1. Connect MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // 2. Connect PostgreSQL (Check connection)
    const client = await pgPool.connect();
    console.log('PostgreSQL Connected');
    client.release(); // Release client back to pool
  } catch (error) {
    console.error('Database Connection Error:', error);
    process.exit(1);
  }
};

pgPool.on('error', (err) => {
  console.error('❌ PostgreSQL Pool Error:', err);
});

module.exports = { connectMongo: connectDB, pgPool };
