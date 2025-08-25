const Joi = require("joi");

const categorySchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
  isActive: Joi.boolean().default(true),
});

module.exports = {
  categorySchema,
};
