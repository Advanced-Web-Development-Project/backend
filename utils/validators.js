const Joi = require('joi');

const loginSchema = Joi.object().keys({
  email: Joi.string().trim().email().required(),
  password: Joi.string().required(),
});

const registerSchema = Joi.object().keys({
  name: Joi.string().trim().required(),
  username: Joi.string().trim().min(4).max(20).regex(/^[a-zA-Z0-9_]+$/).required(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().trim().min(6).required(),
});

module.exports = {
  loginSchema,
  registerSchema,
};
