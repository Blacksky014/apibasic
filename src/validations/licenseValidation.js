// ./src/validations/licenseValidation.js
const Joi = require('joi');
const { ObjectId } = require('mongodb');

const licenseGenerateSchema = Joi.object({
    number: Joi.number().required(),
  });

const licenseActivationSchema = Joi.object({
  activationCode: Joi.string().required(),
  hardwareId: Joi.string().required(),
});

const licenseIdSchema = Joi.object({
  id: Joi.string().required(),
});

const licenseUpdateSchema = Joi.object({
  id: Joi.string().required(),
  activationCode: Joi.string(),
  date: Joi.string(),
  hardwareId: Joi.string(),
  activationCount: Joi.number(),
  locked: Joi.boolean(),
  lastActivationDateTime: Joi.string(),
});


module.exports = {
  licenseGenerateSchema,
  licenseActivationSchema,
  licenseIdSchema,
  licenseUpdateSchema,
};