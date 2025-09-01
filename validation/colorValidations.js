const Joi = require("joi");

// Color creation schema
const colorSchema = Joi.object({
  merchant: Joi.string().required().messages({
    "string.empty": "Merchant ID is required",
    "any.required": "Merchant ID is required"
  }),
  name: Joi.string().required().trim().min(1).max(100).messages({
    "string.empty": "Color name is required",
    "string.min": "Color name must be at least 1 character long",
    "string.max": "Color name cannot exceed 100 characters",
    "any.required": "Color name is required"
  }),
  description: Joi.string().trim().max(500).optional().messages({
    "string.max": "Description cannot exceed 500 characters"
  }),
  category: Joi.string().valid("body", "sleeve", "detail", "accessory", "collar", "hem", "custom").default("body").messages({
    "any.only": "Category must be one of: body, sleeve, detail, accessory, collar, hem, custom"
  }),
  defaultColor: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).default("#FFFFFF").messages({
    "string.pattern.base": "Default color must be a valid hex color code (e.g., #FFFFFF)"
  }),
  defaultGradient: Joi.boolean().default(false),
  productId: Joi.string().optional().messages({
    "string.empty": "Product ID cannot be empty"
  }),
  toolId: Joi.string().optional().messages({
    "string.empty": "Tool ID cannot be empty"
  }),
  // New fields for section-specific customization
  section: Joi.string().optional().messages({
    "string.empty": "Section name cannot be empty"
  }),
  sectionOptions: Joi.array().items(Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required()
  })).optional(),
  colorConfig: Joi.object().pattern(Joi.string(), Joi.object({
    color: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/),
    gradient: Joi.boolean(),
    gradientConfig: Joi.object()
  })).optional()
});




module.exports = {
  colorSchema,
};
