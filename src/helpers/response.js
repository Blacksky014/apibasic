// ./src/helpers/response.js
const nullSafely = require('./nullSafety');
// Send a success response
exports.success = function (res, message, data = null, statusCode = 200) {
  // null safely response
  data = nullSafely(data);
  (data)
    ? res.status(statusCode).json({ success: true, message: message, data: data })
    : res.status(statusCode).json({ success: true, message: message, });
};

// Send an error response
exports.error = function (res, message = 'Internal Server Error', statusCode = 500) {
  if (typeof message === 'object' && Array.isArray(message) && message.length > 0) {
    res.status(statusCode).json({
      success: false,
      errorList: message
    });
  } else if (typeof message === 'object' && Object.keys(message).length > 0) {
    // res.status(statusCode).json({ success: false, ...message });
    const response = Object.assign({ success: false }, message);
    res.status(statusCode).json(response);
  } else {
    res.status(statusCode).json({
      success: false,
      error: message
    });
  }
};