// crud operations for sports validation

const Joi = require("joi");

const sportSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  isActive: Joi.boolean().optional(),
});

const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sortBy: Joi.string()
    .valid("name", "createdAt", "updatedAt")
    .default("createdAt"),
  order: Joi.string().valid("asc", "desc").default("desc"),
  search: Joi.string().allow("").optional(),
});

module.exports = {
  sportSchema,
  paginationSchema,
  // Validation for updating a sport
  updateSportSchema: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    merchant: Joi.string().optional(), // Change to Joi.objectId() if using ObjectId validation
    products: Joi.array().items(Joi.string()).optional(), // Adjust item type as needed
    isActive: Joi.boolean().optional(),
  }),
  // Validation for id param
  idParamSchema: Joi.object({
    id: Joi.string().length(24).hex().required(), // MongoDB ObjectId
  }),
};
