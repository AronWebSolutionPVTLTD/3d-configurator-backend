const { asyncHandler } = require("../../middleware/asyncHandler");
const ColorSwatch = require("../../model/ColorSwatch");
const { successResponse } = require("../../utils/response");

// GET /color-swatches?active=true with pagination
exports.getColorSwatches = asyncHandler(async (req, res) => {
    const { active, page = 1, limit = 10, sortBy = "name", order = "asc", search } = req.query;
    const filter = {};
    if (active === "true") filter.isActive = true;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { value: { $regex: search, $options: "i" } }
      ];
    }

    const swatches = await ColorSwatch.find(filter)
      .sort({ [sortBy]: order === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalCount = await ColorSwatch.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limit);

    const response = {
      colorSwatches: swatches,
      totalCount,
      totalPages,
      currentPage: page,
      pageSize: limit,
    };
    return successResponse(res, response, "Color swatches retrieved successfully", 200);
});

exports.createColorSwatch = asyncHandler(async (req, res) => {
    const swatch = await ColorSwatch.create(req.body);
    res.status(201).json({ success: true, data: swatch });
});

exports.updateColorSwatch = asyncHandler(async (req, res) => {
    const swatch = await ColorSwatch.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!swatch) return res.status(404).json({ success: false, message: "Color swatch not found" });
    res.status(200).json({ success: true, data: swatch });
});

exports.deleteColorSwatch = asyncHandler(async (req, res) => {
    const swatch = await ColorSwatch.findByIdAndDelete(req.params.id);
    if (!swatch) return res.status(404).json({ success: false, message: "Color swatch not found" });
    res.status(200).json({ success: true, message: "Color swatch deleted" });
});
