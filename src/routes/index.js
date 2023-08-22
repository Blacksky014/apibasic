// ./src/routes/index.js
const express = require('express');
const router = express.Router();
const licenseRoutes = require('./licenseRoutes');
const { formatUptime } = require('../helpers/helper');

// API status route
router.get('/status', (req, res) => {
  const uptime = process.uptime();
  res.json({ status: `API is running ${formatUptime(uptime)}` });
});


// Mount other routes
router.use('/base-license', licenseRoutes);

module.exports = router;
