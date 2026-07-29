/**
 * ========================================================
 * HAPPY KIDS SCHOOL - BACKEND EXPRESS SERVER
 * Production-ready REST API Entry Point
 * ========================================================
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const { testConnection } = require('./config/db');
const admissionRoutes = require('./routes/admissionRoutes');
const rfidRoutes = require('./routes/rfidRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Middlewares
app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// 2. Serve Static Uploaded Images (/uploads/<filename>)
const uploadDir = path.join(__dirname, '..', 'uploads');
app.use('/uploads', express.static(uploadDir));

// 3. API Routes
app.use('/api/admission', admissionRoutes);
app.use('/api/rfid', rfidRoutes);

// Health Check Endpoint
app.get('/api/health', async (req, res) => {
  const isDbConnected = await testConnection();
  res.status(200).json({
    success: true,
    service: 'TN Happy Kids School Admission REST API',
    status: 'ONLINE',
    database: isDbConnected ? 'CONNECTED' : 'DISCONNECTED',
    timestamp: new Date().toISOString(),
  });
});

// Root Welcome Endpoint (GET /)
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'TN Happy Kids School Admission API Server',
    message: '🎒 Backend API Server is ONLINE and running normally.',
    frontendWebsite: 'http://localhost:5173/',
    endpoints: {
      healthCheck: 'http://localhost:5000/api/health',
      submitAdmission: 'POST http://localhost:5000/api/admission',
      getAdmission: 'GET http://localhost:5000/api/admission/:id',
    },
    note: 'To access the student admission application web interface, please open http://localhost:5173/ in your browser.',
  });
});

// 4. Handle 404 Route Not Found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    errorType: 'ROUTE_NOT_FOUND',
    message: `The endpoint ${req.method} ${req.originalUrl} does not exist on this server.`,
  });
});

// 5. Centralized Error Handling Middleware
app.use(errorHandler);

// 6. Start Server (Only when executed directly, not when imported by serverless functions)
if (require.main === module) {
  app.listen(PORT, async () => {
    console.log('========================================================');
    console.log(`🎒 TN HAPPY KIDS SCHOOL - ADMISSION API SERVER RUNNING`);
    console.log(`🌐 Server URL       : http://localhost:${PORT}`);
    console.log(`🔗 Health Check     : http://localhost:${PORT}/api/health`);
    console.log(`📂 Static Uploads   : http://localhost:${PORT}/uploads`);
    console.log('========================================================');
    // Test DB connectivity
    await testConnection();
  });
}

module.exports = app;
