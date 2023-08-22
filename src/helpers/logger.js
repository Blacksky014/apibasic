// ./src/helpers/logger.js

const fs = require('fs');
const path = require('path');

// Create a writable stream to log file
const logStream = fs.createWriteStream(path.join(__dirname, '../../logs/app.log'), { flags: 'a' });

// Define log levels
const LogLevel = {
  INFO: 'INFO',
  WARNING: 'WARNING',
  ERROR: 'ERROR'
};

// Function to log messages with status
function log(message, level = LogLevel.INFO) {
  const timestamp = new Date().toISOString();
  if (typeof message === 'object' && Object.keys(message).length > 0) {
    message = JSON.stringify(message);
  };
  const logMessage = `[${timestamp}] [${level}] ${message}\n`;


  // Write the log message to console
  console.log(logMessage);

  // Write the log message to the log file
  logStream.write(logMessage);
}

module.exports = {
  log,
  LogLevel
};


// const logger = require('./logger');

// // Usage example
// logger.log('This is an information message', logger.LogLevel.INFO);
// logger.log('This is a warning message', logger.LogLevel.WARNING);
// logger.log('This is an error message', logger.LogLevel.ERROR);