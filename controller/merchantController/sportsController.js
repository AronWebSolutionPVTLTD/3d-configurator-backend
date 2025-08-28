// create crud operations for sports controller functions

const { asyncHandler } = require("../../middleware/asyncHandler");
const Sport = require("../../model/Sport");
const { successResponse } = require("../../utils/response");

const createSport = asyncHandler(async (req, res) => {
  const { name, isActive = true } = req.body;
  const merchant = req.user._id;
  const sport = new Sport({ name, merchant, isActive });
  await sport.save();
  return successResponse(res, sport, "Sport created successfully", 201);
});

const getSports = asyncHandler(async (req, res) => {
  const { page, limit, sortBy, order, search } = req.query;
  // const query = {
  //   isActive: true,
  // };
  const query = {};
  if (search) {
    query.name = { $regex: search, $options: "i" };
  }
  const sports = await Sport.find(query)
    // .populate("merchant")
    // .populate("products")
    .sort({ [sortBy]: order === "asc" ? 1 : -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  // get total count
  const totalCount = await Sport.countDocuments(query);
  const totalPages = Math.ceil(totalCount / limit);

  const response = {
    sports,
    totalCount,
    totalPages,
    currentPage: page,
    pageSize: limit,
  };

  return successResponse(res, response, "Sports retrieved successfully", 200);
});

const getSport = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const sport = await Sport.findById(id)
    .populate("merchant")
    .populate("products");
  if (!sport) {
    throw new Error("Sport not found");
  }
  return successResponse(res, sport, "Sport retrieved successfully", 200);
});

const updateSport = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, merchant, products, isActive } = req.body;
  const sport = await Sport.findByIdAndUpdate(
    id,
    { name, merchant, products, isActive },
    { new: true }
  );
  if (!sport) {
    throw new Error("Sport not found");
  }
  return successResponse(res, sport, "Sport updated successfully", 200);
});

const deleteSport = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const sport = await Sport.findByIdAndDelete(id);
  if (!sport) {
    throw new Error("Sport not found");
  }
  return successResponse(res, sport, "Sport deleted successfully", 200);
});

module.exports = {
  createSport,
  getSports,
  getSport,
  updateSport,
  deleteSport,
};
