const {asyncHandler} = require("../../middleware/asyncHandler");
const Font = require("../../model/Font");
const { successResponse } = require("../../utils/response");

// GET /fonts - public list (optionally filter by isActive) with pagination
exports.getFonts = asyncHandler(async (req, res) => {
  const { active, page = 1, limit = 10, sortBy = "createdAt", order = "desc", search } = req.query;
  const filter = {};
  if (active === "true") filter.isActive = true;
  if (active === "false") filter.isActive = false;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { label: { $regex: search, $options: "i" } },
      { fontFamily: { $regex: search, $options: "i" } }
    ];
  }

  const fonts = await Font.find(filter)
    .sort({ [sortBy]: order === "asc" ? 1 : -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const totalCount = await Font.countDocuments(filter);
  const totalPages = Math.ceil(totalCount / limit);

  const response = {
    fonts,
    totalCount,
    totalPages,
    currentPage: page,
    pageSize: limit,
  };
  return successResponse(res, response, "Fonts retrieved successfully", 200);
});

// GET /fonts/:id
exports.getFont = asyncHandler(async (req, res) => {
  const font = await Font.findById(req.params.id);
  if (!font) return res.status(404).json({ success: false, message: "Font not found" });
  res.status(200).json({ success: true, data: font });
});

// POST /fonts
exports.createFont = asyncHandler(async (req, res) => {
  const { name, label, fontFamily, category, isActive } = req.body;
  const font = await Font.create({ name, label, fontFamily, category, isActive });
  res.status(201).json({ success: true, data: font });
});

// PUT /fonts/:id
exports.updateFont = asyncHandler(async (req, res) => {
  const updates = req.body;
  const font = await Font.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
  if (!font) return res.status(404).json({ success: false, message: "Font not found" });
  res.status(200).json({ success: true, data: font });
});

// DELETE /fonts/:id
exports.deleteFont = asyncHandler(async (req, res) => {
  const font = await Font.findByIdAndDelete(req.params.id);
  if (!font) return res.status(404).json({ success: false, message: "Font not found" });
  res.status(200).json({ success: true, message: "Font deleted" });
});
