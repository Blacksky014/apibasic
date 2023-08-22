const { ObjectId } = require('mongodb');
const MongoDBConnection = require('../utils/mongoDbConnection');
const dbConnection = new MongoDBConnection();
const collectionName = 'licenses';
const { StatusCodes } = require('http-status-codes');
const createError = require('http-errors');
const bcrypt = require('bcryptjs');

const secretKey = 'secretkey';
// Function to generate a random salt
async function generateSalt() {
    const saltRounds = 10; // Number of salt rounds for hashing
    return bcrypt.genSaltSync(saltRounds);
  }

  // Function to hash the password
async function generateLicenseKey(hardwareId) {
    try {
      const salt = await generateSalt();
      const licenseKey = await bcrypt.hash(hardwareId.trim() + secretKey, salt);
      return licenseKey;
    } catch (error) {
      throw new Error('Error generate license key');
    }
  }

  async function verifyLicenseKey(hardwareId, licenseKey) {
    try {
      const match = await bcrypt.compare(hardwareId.trim() + secretKey, licenseKey.trim());
      return match;
    } catch (error) {
      throw new Error('Error comparing licenseKey');
    }
  }

  function generateActivationCode(length) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let generateCode = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      generateCode += charset.charAt(randomIndex);
    }
    return generateCode;
  }

  async function generateLicense(number) {
    try {
      const generatedLicenses = [];
  
      const currentDate = new Date();
      for (let i = 0; i < number; i++) {
        const generateData = {
          activationCode: generateActivationCode(10),
          date: currentDate.toISOString(),
          hardwareId: null,
          activationCount: 0,
          locked: false,
        };
        generatedLicenses.push(generateData);
      }
  
      await dbConnection.connect();
      const db = await dbConnection.getDatabase();
      const result = await db.collection(collectionName).insertMany(generatedLicenses);
  
      if (result.acknowledged === true && result.insertedCount > 0) {
        return { generateIds: result.insertedIds };
      } else {
        throw createError(StatusCodes.BAD_REQUEST, 'Failed to generate license');
      }
    } catch (error) {
      throw error;
    }
  }

  async function activationLicense(activationCode, hardwareId) {
    try {
      // Connect to the database
      await dbConnection.connect();
      const db = await dbConnection.getDatabase();
  
      // Find the license using the activation code
      const existingLicense = await db.collection(collectionName).findOne({ activationCode });
  
      if (!existingLicense) {
        throw new Error('License not found.'); // Handle the case when the license is not found.
      }

      if (existingLicense.locked == true) {
        throw new Error('License is locked.'); // Handle the case when the license is not found.
      }

      if (existingLicense.activationCount > 0 && existingLicense.hardwareId != hardwareId) {
        throw createError(StatusCodes.BAD_REQUEST, 'License activation failed, HardwareId does not match.');
      }
  
      // Update the activation count, hardware ID, and last activation date time
      const currentDate = new Date();
      const updatedLicense = {
        ...existingLicense,
        hardwareId: hardwareId,
        activationCount: existingLicense.activationCount + 1,
        lastActivationDateTime: currentDate.toISOString(), // Store the last activation date time in ISO format.
      };
  
      // Update the license in the database
      const result = await db.collection(collectionName).findOneAndUpdate(
        { activationCode: activationCode },
        { $set: updatedLicense },
        { returnNewDocument: true , returnDocument: "after"} // (Note: This line is commented out)
      );
  
      return result.value; // Return the updated license information.
    } catch (error) {
      throw error;
    }
  }
  
  async function getLicense(id) {
    try {
      await dbConnection.connect();
      const db = await dbConnection.getDatabase();
      if(id != null){
        const result = db.collection(collectionName).findOne({ _id: new ObjectId(id) });
        return result;
      } else {
        const cursor = db.collection(collectionName).find();
        const result = await cursor.toArray();
        return result;
      }
    } catch (error) {
      throw createError(StatusCodes.BAD_REQUEST, 'Error retrieving license:');
    }
}

async function updateLicense(licenseData){
  try {
    const id = licenseData.id;
    delete licenseData.id;
    await dbConnection.connect();
    const db = await dbConnection.getDatabase();
    const collection = db.collection(collectionName);
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: licenseData },
      { returnNewDocument: true , returnDocument: "after"}
    );
    return result.value;
  } catch (error) {
    throw error;
  }
}

async function deleteLicense(id) {
  try{
    await dbConnection.connect();
    const db = await dbConnection.getDatabase();
    const result = await db.collection(collectionName).findOneAndDelete({ _id: new ObjectId(id) });
    return result.value;
  } catch (error) {
    throw error;
  }
}
  
  module.exports = {
    generateLicenseKey,
    verifyLicenseKey,
    generateLicense,
    activationLicense,
    getLicense,
    updateLicense,
    deleteLicense,
}