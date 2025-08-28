const { asyncHandler } = require("../../middleware/asyncHandler");
const Category = require("../../model/Category");
const { successResponse } = require("../../utils/response");

// Create Category
const createCategory = asyncHandler(async (req, res) => {
	const { name, description, isActive = true } = req.body;
	const merchant = req.user._id;
	const category = new Category({ name, description, merchant, isActive });
	await category.save();
	return successResponse(res, category, "Category created successfully", 201);
});

// Get Categories (with pagination, search, sort)
const getCategories = asyncHandler(async (req, res) => {
	const { page = 1, limit = 10, sortBy = "createdAt", order = "desc", search } = req.query;
	const query = { merchant: req.user._id };
	if (search) {
		query.name = { $regex: search, $options: "i" };
	}
	const categories = await Category.find(query)
		.sort({ [sortBy]: order === "asc" ? 1 : -1 })
		.skip((page - 1) * limit)
		.limit(Number(limit));

	const totalCount = await Category.countDocuments(query);
	const totalPages = Math.ceil(totalCount / limit);

	const response = {
		categories,
		totalCount,
		totalPages,
		currentPage: page,
		pageSize: limit,
	};
	return successResponse(res, response, "Categories retrieved successfully", 200);
});

// Get Single Category
const getCategory = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const category = await Category.findById(id).populate("merchant");
	if (!category) {
		throw new Error("Category not found");
	}
	return successResponse(res, category, "Category retrieved successfully", 200);
});

// Update Category
const updateCategory = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const { name, description, isActive } = req.body;
	const category = await Category.findByIdAndUpdate(
		id,
		{ name, description, isActive },
		{ new: true }
	);
	if (!category) {
		throw new Error("Category not found");
	}
	return successResponse(res, category, "Category updated successfully", 200);
});

// Delete Category
const deleteCategory = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const category = await Category.findByIdAndDelete(id);
	if (!category) {
		throw new Error("Category not found");
	}
	return successResponse(res, category, "Category deleted successfully", 200);
});

module.exports = {
	createCategory,
	getCategories,
	getCategory,
	updateCategory,
	deleteCategory,
};
