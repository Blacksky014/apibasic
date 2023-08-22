// ./src/middlewares/validationHandler.js
const { ReasonPhrases, StatusCodes, getReasonPhrase, getStatusCode } = require('http-status-codes');
function validationHandler(validationSchema, property = 'body') { // body || params
    return (req, res, next) => {
      const { error } = validationSchema.validate(req[property]);
  
      if (error) {
        const errorMessage = error.details[0].message.replace(/['"]/g, '');
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false, 
          error: errorMessage 
        });
      }
      next();
    };
  }
  
  module.exports = validationHandler;
  