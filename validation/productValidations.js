const Joi = require("joi");

// Product creation/update validation schema
const productSchema = Joi.object({
  name: Joi.string().required().trim().min(2).max(100).messages({
    "string.empty": "Product name is required",
    "string.min": "Product name must be at least 2 characters long",
    "string.max": "Product name cannot exceed 100 characters",
  }),

  description: Joi.string().optional().trim().max(500).messages({
    "string.max": "Description cannot exceed 500 characters",
  }),

  category: Joi.string().required().hex().length(24).messages({
    "string.hex": "Category ID must be a valid MongoDB ObjectId",
    "string.length": "Category ID must be 24 characters long",
  }),

  basePrice: Joi.number().default(5).optional(),

  sport: Joi.string().required().hex().length(24).messages({
    "string.hex": "Sport ID must be a valid MongoDB ObjectId",
    "string.length": "Sport ID must be 24 characters long",
  }),

  images: Joi.array()
    .items(
      Joi.object({
        url: Joi.string().required().uri().messages({
          "string.uri": "Image URL must be a valid URI",
        }),
        alt: Joi.string().optional().max(100),
      })
    )
    .optional(),

  tools: Joi.array().items(Joi.string().hex().length(24)).optional(),

  stock: Joi.object({
    quantity: Joi.number().min(0).default(0),
    isUnlimited: Joi.boolean().default(false),
  }).optional(),

  status: Joi.string()
    .valid("draft", "active", "inactive", "archived")
    .default("draft"),
});

// Product update validation schema (all fields optional)
const productUpdateSchema = Joi.object({
  name: Joi.string().required().trim().min(2).max(100).messages({
    "string.empty": "Product name is required",
    "string.min": "Product name must be at least 2 characters long",
    "string.max": "Product name cannot exceed 100 characters",
  }),

  description: Joi.string().optional().trim().max(500).messages({
    "string.max": "Description cannot exceed 500 characters",
  }),

  category: Joi.string().required().hex().length(24).messages({
    "string.hex": "Category ID must be a valid MongoDB ObjectId",
    "string.length": "Category ID must be 24 characters long",
  }),

  basePrice: Joi.number().default(5).optional(),

  sport: Joi.string().required().hex().length(24).messages({
    "string.hex": "Sport ID must be a valid MongoDB ObjectId",
    "string.length": "Sport ID must be 24 characters long",
  }),

  images: Joi.array()
    .items(
      Joi.object({
        url: Joi.string().required().uri().messages({
          "string.uri": "Image URL must be a valid URI",
        }),
        alt: Joi.string().optional().max(100),
      })
    )
    .optional(),

  tools: Joi.array().items(Joi.string().hex().length(24)).optional(),

  stock: Joi.object({
    quantity: Joi.number().min(0).default(0),
    isUnlimited: Joi.boolean().default(false),
  }).optional(),

  status: Joi.string()
    .valid("draft", "active", "inactive", "archived")
    .default("draft"),
});

// Product status update schema
const productStatusSchema = Joi.object({
  status: Joi.string()
    .required()
    .valid("draft", "active", "inactive", "archived")
    .messages({
      "any.only": "Status must be one of: draft, active, inactive, archived",
    }),
});

// Product query parameters validation
const productQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sortBy: Joi.string()
    .valid("name", "basePrice", "createdAt", "updatedAt")
    .default("createdAt"),
  order: Joi.string().valid("asc", "desc").default("desc"),
  search: Joi.string().optional().trim(),
  category: Joi.string()
    .optional()
    .valid("jersey", "shorts", "jacket", "headgear", "other"),
  sport: Joi.string().optional().hex().length(24),
  status: Joi.string()
    .optional()
    .valid("draft", "active", "inactive", "archived"),
});

module.exports = {
  productSchema,
  productUpdateSchema,
  productStatusSchema,
  productQuerySchema,
};
