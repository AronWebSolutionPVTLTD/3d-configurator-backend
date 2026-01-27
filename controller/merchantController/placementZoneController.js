const { asyncHandler } = require("../../middleware/asyncHandler");
const PlacementZone = require("../../model/PlacementZone");
const { successResponse } = require("../../utils/response");

// GET /placement-zones?toolType=name&active=true with pagination
exports.getPlacementZones = asyncHandler(async (req, res) => {
    const { toolType, active, page = 1, limit = 10, sortBy = "order", order: sortOrder = "asc", search } = req.query;
    const filter = {};
    if (toolType) filter.toolType = toolType;
    if (active === "true") filter.isActive = true;
    if (active === "false") filter.isActive = false;
    if (search) {
      filter.$or = [
        { key: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
        { label: { $regex: search, $options: "i" } }
      ];
    }

    const zones = await PlacementZone.find(filter)
      .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalCount = await PlacementZone.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limit);

    const response = {
      placementZones: zones,
      totalCount,
      totalPages,
      currentPage: page,
      pageSize: limit,
    };
    return successResponse(res, response, "Placement zones retrieved successfully", 200);
});

exports.getPlacementZone = asyncHandler(async (req, res) => {
    const zone = await PlacementZone.findById(req.params.id);
    if (!zone) return res.status(404).json({ success: false, message: "Placement zone not found" });
    res.status(200).json({ success: true, data: zone });
});

exports.createPlacementZone = asyncHandler(async (req, res) => {
    const zone = await PlacementZone.create(req.body);
    res.status(201).json({ success: true, data: zone });
});

exports.updatePlacementZone = asyncHandler(async (req, res) => {
    const zone = await PlacementZone.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!zone) return res.status(404).json({ success: false, message: "Placement zone not found" });
    res.status(200).json({ success: true, data: zone });
});

exports.deletePlacementZone = asyncHandler(async (req, res) => {
    const zone = await PlacementZone.findByIdAndDelete(req.params.id);
    if (!zone) return res.status(404).json({ success: false, message: "Placement zone not found" });
    res.status(200).json({ success: true, message: "Placement zone deleted" });
});
