// ./src/helpers/passwordUtils.js
const bcrypt = require('bcryptjs');

// Function to generate a random salt
function generateSalt() {
  const saltRounds = 10; // Number of salt rounds for hashing
  return bcrypt.genSaltSync(saltRounds);
}

// Function to hash the password
async function hashPassword(password) {
  try {
    const salt = generateSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    throw new Error('Error hashing password');
  }
}

// Function to check if the provided password matches the hashed password
async function passwordMatch(password, hashedPassword) {
  try {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
  } catch (error) {
    throw new Error('Error comparing passwords');
  }
}

function verifyPassword(password, hashedPassword) {
  return bcrypt.compareSync(password, hashedPassword);
}

function generateRandomPassword(length) {
  // const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-={}[]|:;"<>,.?/~`';
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset.charAt(randomIndex);
  }

  return password;

  // Usage example
  // const passwordLength = 10; // You can change the length as per your requirements
  // const randomPassword = generateRandomPassword(passwordLength);
  // console.log('Random Password:', randomPassword);
}

// Generate a random 6-digit verification code
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateTrackingId() {
  const length = 12; // Length of the tracking ID
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let trackingId = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    trackingId += characters.charAt(randomIndex);
  }

  return trackingId;
}

module.exports = { 
  hashPassword, 
  passwordMatch , 
  generateRandomPassword,
  generateVerificationCode,
  generateTrackingId,
};
