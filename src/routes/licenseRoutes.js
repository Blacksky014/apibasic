// ./src/routes/licenseRoute.js
const express = require('express');
const router = express.Router();
const licenseController = require('../controllers/licenseController');
const licenseValidation = require('../validations/licenseValidation');
const validationHandler = require('../middlewares/validationHandler');

// Sample in-memory database for storing valid tokens
const validTokens = ['license-activation-secret-token'];

// Custom middleware to protect API endpoints using token
function protectHeaderToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Token not provided.' });
  }

  if (!validTokens.includes(token)) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token.' });
  }

  next(); // If the token is valid, move on to the next middleware or the route handler.
}

// Generate License Code Route
router.post('/generate-license/:number', 
validationHandler(licenseValidation.licenseGenerateSchema, 'params'),
licenseController.generateLicense);

// Activation License Route
router.post('/activate-license', 
protectHeaderToken,
validationHandler(licenseValidation.licenseActivationSchema),
licenseController.activationLicense);

// Get All License Route
router.get('/license', 
licenseController.getLicense);


// Get License Route
router.get('/license/:id', 
validationHandler(licenseValidation.licenseIdSchema, 'params'),
licenseController.getLicense);

// Update License Route
router.put('/license', 
validationHandler(licenseValidation.licenseUpdateSchema),
licenseController.updateLicense);

// Delete License Route
router.delete('/license/:id', 
validationHandler(licenseValidation.licenseIdSchema, 'params'),
licenseController.deleteLicense);

module.exports = router;