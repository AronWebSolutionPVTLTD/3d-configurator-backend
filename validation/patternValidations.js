const Joi = require('joi');

// Pattern creation validation schema
const patternSchema = Joi.object({
  name: Joi.string().required().trim().min(1).max(100).messages({
    'string.empty': 'Pattern name is required',
    'string.min': 'Pattern name must be at least 1 character long',
    'string.max': 'Pattern name cannot exceed 100 characters',
    'any.required': 'Pattern name is required'
  }),
  description: Joi.string().optional().trim().max(500),
  category: Joi.string().valid('geometric', 'stripes', 'abstract', 'texture', 'custom').default('geometric').messages({
    'any.only': 'Category must be one of: geometric, stripes, abstract, texture, custom'
  }),
  image: Joi.string().required().uri().optional(),
  defaultScale: Joi.number().min(0.1).max(10).default(1).messages({
    'number.min': 'Default scale must be at least 0.1',
    'number.max': 'Default scale cannot exceed 10'
  }),
  defaultAngle: Joi.number().min(0).max(360).default(0).messages({
    'number.min': 'Default angle must be at least 0',
    'number.max': 'Default angle cannot exceed 360'
  }),
  defaultColor: Joi.string().pattern(/^#[0-9A-F]{6}$/i).default('#000000').messages({
    'string.pattern.base': 'Default color must be a valid hex color code'
  }),
  defaultBackgroundColor: Joi.string().pattern(/^#[0-9A-F]{6}$/i).default('#FFFFFF').messages({
    'string.pattern.base': 'Default background color must be a valid hex color code'    
  }),
  tools: Joi.array().items(Joi.string().hex().length(24)).optional().messages({
    'array.base': 'Tools must be an array',
    'string.hex': 'Tool ID must be a valid MongoDB ObjectId',
    'string.length': 'Tool ID must be 24 characters long'
  }),
  metadata: Joi.object().pattern(Joi.string(), Joi.string()).optional()
});



module.exports = {
  patternSchema,
};
