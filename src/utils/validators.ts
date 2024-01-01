import Joi from 'joi';

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

const postSchema = Joi.object().keys({
  // user: Joi.string().trim().required(),
  title: Joi.string().trim().required(),
  content: Joi.string().trim().required(),
  imagePath: Joi.string().trim(),
  // likes: Joi.array().unique(),
  // dislikes: Joi.array().unique(),
})

const validateSchema = (schema: Joi.Schema, data: object) => {
  const { error } = schema.validate(data, { abortEarly: false });
  if (error) {
    const errorMessages = error.details.map((detail) => {
      return detail.message.replace(/"/g, '');
    });
    return errorMessages
  }
  return null
}

export {
  loginSchema,
  registerSchema,
  postSchema,
  validateSchema
};