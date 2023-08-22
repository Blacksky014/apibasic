// ./src/configs/envConfig.js

require('dotenv').config();

function validateEnv() {
  const requiredVariables = [
    'SERVER_PORT', 
    'LOCAL_TIME_ZONE',
    'DB_HOST', 
    'DB_PORT', 
    'DB_NAME',
    'REDIS_HOST',
    'REDIS_PORT',
    'JWT_SECRET',
    'JWT_EXPIRATION',
    'JWT_REFRESH_SECRET',
    'JWT_REFRESH_EXPIRATION'
];

  for (const variable of requiredVariables) {
    if (!process.env[variable]) {
      throw new Error(`Missing required environment variable: ${variable}`);
    }
  }
}

const env = {
  server: {
    port: process.env.SERVER_PORT || 3000,
    apiBasePath: process.env.API_BASE_PATH,
    localTimeZone: process.env.LOCAL_TIME_ZONE,
    userProfileImagePath : process.env.USER_PROFILE_IMAGE_PATH
  },
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiration: process.env.JWT_EXPIRATION,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiration: process.env.JWT_REFRESH_EXPIRATION,
  },
  nodemailer: {
   emailFrom: process.env.EMAIL_FROM,
   emailService: process.env.EMAIL_SERVICE,
   emailUserName: process.env.EMAIL_USERNAME,
   emailPassword: process.env.EMAIL_PASSWORD,
  },
  twilio: {
    twilioSID: process.env.TWILIO_SID,
    twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
    twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER,
  }
};

module.exports = {
    validateEnv, 
    env
};
