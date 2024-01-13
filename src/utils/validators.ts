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
  title: Joi.string().trim().required(),
  content: Joi.string().trim().required(),
  imagePath: Joi.string().trim(),
	category: Joi.string().trim(),
});

const updatePostSchema = Joi.object().keys({
	title: Joi.string().trim(),
	content: Joi.string().trim(),
	imagePath: Joi.string().trim(),
});

const commentSchema = Joi.object().keys({
	content: Joi.string().trim().required(),
});

const updateUserSchema = Joi.object().keys({
  email: Joi.string().trim().email(),
  password: Joi.string().trim().min(6),
  username: Joi.string().trim().min(4).max(20).regex(/^[a-zA-Z0-9_]+$/),
  name: Joi.string().trim(),
  avatar: Joi.string().trim(),
});

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
	updatePostSchema,
	commentSchema,
	updateUserSchema,
  validateSchema
};
