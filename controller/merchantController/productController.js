const { asyncHandler } = require("../../middleware/asyncHandler");
const Product = require("../../model/Product");
const { successResponse } = require("../../utils/response");

const getProducts = asyncHandler(async (req, res) => {
  const { page, limit, sortBy, order, search } = req.query;
  // const query = {
  //   isActive: true,
  // };
  const query = {};
  if (search) {
    query.name = { $regex: search, $options: "i" };
  }
  const products = await Product.find(query)
    .sort({ [sortBy]: order === "asc" ? 1 : -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  // get total count
  const totalCount = await Product.countDocuments(query);
  const totalPages = Math.ceil(totalCount / limit);

  const response = {
    products,
    totalCount,
    totalPages,
    currentPage: page,
    pageSize: limit,
  };
  return successResponse(res, response, "Products retrieved successfully", 200);
});

module.exports = {
  getProducts,
};
