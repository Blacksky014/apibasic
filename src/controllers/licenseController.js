// ./src/controllers/licenseController.js
const fs = require('fs-extra');
const path = require('path');
const licenseService = require('../services/licenseService');
const { validationResult } = require('express-validator');
const { env } = require('../configs/envConfig');
const response = require('../helpers/response');
const { ReasonPhrases, StatusCodes, getReasonPhrase, getStatusCode } = require('http-status-codes');
const { hashPassword, passwordMatch, generateVerificationCode } = require('../helpers/passwordUtils');
const sharp = require('sharp'); // compressed image
const { promisify } = require('util');
const { v4: uuidv4 } = require('uuid');
const createError = require('http-errors');

const record = "License";
// Get all users
async function generateLicense(req, res, next) {
    try {
        const { number } = req.params;
        if (!number) {
            return response.error(res, `${record} number count is required`, StatusCodes.BAD_REQUEST);
        }
        const licesnseResult = await licenseService.generateLicense(number);
        if (licesnseResult) {
            return response.success(res, `${record} created successfully`, licesnseResult, StatusCodes.CREATED);
        } else {
            return response.error(res, `Failed to create ${record}.`);
        }
    } catch (error) {
        next(error);
    }
}

async function activationLicense(req, res, next) {
    try {
        const { activationCode, hardwareId } = req.body;
        console.log(`hardwareId ${hardwareId}`);

        
        
        const licesnseResult = await licenseService.activationLicense(activationCode, hardwareId);
        if (licesnseResult) {
            const generatedLicenseKey = await licenseService.generateLicenseKey(hardwareId);
            console.log(generatedLicenseKey);
            const verifyLicense = await licenseService.verifyLicenseKey(hardwareId,generatedLicenseKey);
            console.log(`verifyLicense ${verifyLicense}`);
            if (verifyLicense) {
                licesnseResult.licenseKey = generatedLicenseKey;
            }
            return response.success(res, `${record} activation successfully`, licesnseResult, StatusCodes.CREATED);
        } else {
            return response.error(res, `Failed to activation ${record}.`);
        }
    } catch (error) {
        next(error);
    }
}

async function getLicense(req, res, next) {
    try {
        const { id } = req.params;
        const licesnseResult = await licenseService.getLicense(id);
        if (licesnseResult) {
            return response.success(res, `Successfully retrieved ${record}s`, licesnseResult);
        } else {
            return response.error(res, `${record}s not found`, StatusCodes.NOT_FOUND);
        }
    } catch (error) {
        next(error);
    }
}

async function updateLicense(req, res, next) {
    try {
        const licenseData = req.body;
        const result = await licenseService.updateLicense(licenseData);
        if (!result) {
            return response.error(res, `${record} not found`, StatusCodes.NOT_FOUND);
        }
        response.success(res, `${record} updated successfully`, result);
    } catch (error) {
        next(error);
    }
}

async function deleteLicense(req, res, next) {
    try {
        const { id } = req.params;
        const result = await licenseService.deleteLicense(id);
        if (!result) {
            return response.error(res, `${record} not found`, StatusCodes.NOT_FOUND);
        }
        response.success(res, `${record} deleted successfully`, result, StatusCodes.OK);
    } catch (error) {
        next(error);
    }
}


module.exports = {
    generateLicense,
    activationLicense,
    getLicense,
    updateLicense,
    deleteLicense,
};