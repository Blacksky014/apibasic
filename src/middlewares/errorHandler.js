// ./src/middlewares/errorHandler.js
const logger = require('../helpers/logger');
const { ReasonPhrases, StatusCodes, getReasonPhrase, getStatusCode } = require('http-status-codes');

function errorHandler(err, req, res, next) {
  // Check if the error has a status code, otherwise set it to 500 (Internal Server Error)
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  let errorCode = null;
  // Default error message
  let errorMessage = 'Internal Server Error';

  // Check if the error has a custom message, otherwise use the default message
  if (err.message) {
    if (err.message === 'User not found') {
      errorMessage = 'User not found';
      statusCode = StatusCodes.NOT_FOUND;
      errorCode = 'USER_NOT_FOUND';
    } else {
      errorMessage = err.message;
      errorCode = err.statusCode
    }
  }

  

  // Log the error with additional information
  const errorDetails = {
    timestamp: new Date().toISOString(),
    url: req.url,
    method: req.method,
    headers: req.headers,
    // Include any other relevant information like user ID, request ID, etc.
  };

  // Log the error
  // console.error(err);
  // logger.log({ error: err, details: errorDetails }, logger.LogLevel.ERROR);
  logger.log(err , logger.LogLevel.ERROR);
  

  // Set the response status and send the error message as JSON
  res.status(statusCode).json({
    success: false,
    error: errorMessage,
  });
  // res.status(statusCode).json({
  //   success: false,
  //   error: {
  //     message: errorMessage,
  //     // code: errorCode, // Optional, can be used to identify specific error types
  //   },
  // });
}

module.exports = errorHandler;
