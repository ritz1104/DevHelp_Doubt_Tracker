const Doubt = require("../models/doubt");


// controllers/doubtController.js
const getAllDoubts = async (req, res) => {
  try {
    const { status, page = 1 } = req.query;
    const limit = 10;
    const skip = (page - 1) * limit;
    const filter = status ? { status } : {};

    const doubts = await Doubt.find(filter)
      .populate("student", "name")
      .populate({
        path: "comments",
        populate: { path: "createdBy", select: "name" }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json(doubts);
  } catch (err) {
    console.error("🔥 Error fetching doubts:", err);
    res.status(500).json({ message: "Failed to fetch doubts", error: err.message });
  }
};



const resolveDoubt = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Doubt.findByIdAndUpdate(
      id,
      { status: "resolved" },
      { new: true }
    );

    res.json({ message: "Doubt marked as resolved", doubt: updated });
  } catch (err) {
    res.status(500).json({ message: "Error resolving doubt" });
  }
};
const getDoubtById = async (req, res) => {
  try {
    const doubt = await Doubt.findById(req.params.id)
      .populate("student", "name")
      .populate({
        path: "comments",
        populate: {
          path: "createdBy",
          select: "name",
        },
      });

    if (!doubt) {
      return res.status(404).json({ message: "Doubt not found" });
    }

    res.json(doubt); // <-- does this include `fileUrl`?
  } catch (err) {
    console.error("getDoubtById error:", err);
    res.status(500).json({ message: "Error fetching doubt" });
  }
};



module.exports = {
  getAllDoubts,
    resolveDoubt,
  getDoubtById,}