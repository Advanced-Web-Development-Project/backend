const Joi = require('joi');
const HttpResponse = require('../utils/httpResponse');

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
  user: Joi.string().trim().required(),
  title: Joi.string().trim().required(),
  content: Joi.string().trim().required(),
  imagePath: Joi.string().trim().required(),
  likes: Joi.array().unique(),
  dislikes: Joi.array().unique(),
})

const validateSchema = (schema, data) => {

  const { error } = schema.validate(data, { abortEarly: false });

  if (error) {
    const errorMessages = error.details.map((detail) => {
      return detail.message.replace(/"/g, ''); // replace for better formatting
    });

    let response = new HttpResponse()
      .withStatusCode(422)
      .addError(errorMessages)
      .build();

    return response

  }
  return null

}

// user: {
//   type: mongoose.Schema.Types.ObjectId,
//   ref: 'user',
//   required: true
// },
// title: {
//   type: String,
//   required: true,
// },
// imagePath: {
//   type: String,
//   required: true,
// },
// likes: {
//   type: [String],
//   unique: true,
//   default: [],
// },
// dislikes: {
//   type: [String],
//   unique: true,
//   default: [],
// },
// content: {
//   type: String,
//   required: true
// },

// },
// { timestamps: true }

module.exports = {
  loginSchema,
  registerSchema,
  postSchema,
  validateSchema
};
