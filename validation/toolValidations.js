const Joi = require("joi");

const toolSchema = Joi.object({
  value: Joi.string().required().trim().min(2).max(50).messages({
    "string.empty": "Tool value is required",
    "string.min": "Tool value must be at least 2 characters long",
    "string.max": "Tool value cannot exceed 50 characters"
  }),
  
  label: Joi.string().required().trim().min(2).max(100).messages({
    "string.empty": "Tool label is required",
    "string.min": "Tool label must be at least 2 characters long",
    "string.max": "Tool label cannot exceed 100 characters"
  }),
  
  description: Joi.string().optional().trim().max(500).messages({
    "string.max": "Description cannot exceed 500 characters"
  }),
  
  relatedModels: Joi.array().items(
    Joi.object({
      model: Joi.string().required(),
      ref: Joi.string().hex().length(24).required()
    })
  ).optional()
});

module.exports = {
  toolSchema
};
