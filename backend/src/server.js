const express = require('express');
const cors = require('cors');
const { connectMongo } = require('./config/db');
const apiRoutes = require('./routes/api');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Setup
connectMongo();

// Routes
app.use('/api', apiRoutes);

// Root
app.get('/', (req, res) => {
  res.send('CipherSQLStudio Backend Running 🚀');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
