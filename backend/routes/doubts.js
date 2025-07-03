// routes/doubts.js
const express = require("express");
const { body, validationResult } = require("express-validator");
const { authMiddleware, isMentor } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");       // Multer middleware
const Doubt = require("../models/doubt");
const { resolveDoubt, getAllDoubts, getDoubtById } = require("../controllers/doubtController");



const router = express.Router();

      // Build the new doubt object
router.post(
  "/",
  authMiddleware,
  upload.single("screenshot"),                         // handle a single file field named 'screenshot'
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").notEmpty().withMessage("Description is required"),
    // no need to validate fileUrl here
  ],
  async (req, res) => {

     console.log("📥 req.body =", req.body);
    console.log("📁 req.file =", req.file);
    // check text validation
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const { title, description, fileUrl } = req.body;

      // build base data
      const doubtData = {
        title,
        description,
        student: req.user.id,
      };

      // if a file was uploaded, use it
      if (req.file) {
        doubtData.fileUrl = `/uploads/${req.file.filename}`;
      }
      // otherwise if client provided a URL, use that
      else if (fileUrl) {
        doubtData.fileUrl = fileUrl;
      }

      const doubt = new Doubt(doubtData);
      await doubt.save();

      res.status(201).json(doubt);
    } catch (err) {
      console.error("Error while saving doubt:", err);
      res.status(500).json({ msg: "Server error" });
    }
  }
);


// middleware/upload.js already imported as upload
router.put(
  "/:id/screenshot",
  authMiddleware,
  upload.single("screenshot"),
  async (req, res) => {
    try {
      const doubt = await Doubt.findById(req.params.id);
      if (!doubt) return res.status(404).json({ msg: "Not found" });
      if (doubt.student.toString() !== req.user.id)
        return res.status(403).json({ msg: "Unauthorized" });
      if (doubt.status === "resolved")
        return res.status(400).json({ msg: "Cannot modify resolved doubt" });

      // Must have uploaded file
      if (!req.file)
        return res.status(400).json({ msg: "No file provided" });

      doubt.fileUrl = `/uploads/${req.file.filename}`;
      await doubt.save();
      res.json(doubt);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Server error" });
    }
  }
);

// Get Student's Doubts
router.get("/mine", authMiddleware, async (req, res) => {
  try {
    const doubts = await Doubt.find({ student: req.user.id })
      .populate({
        path: "comments",
        populate: { path: "createdBy", select: "name" }
      })
      .sort({ createdAt: -1 });

    res.json(doubts);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Edit Doubt
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const doubt = await Doubt.findById(req.params.id);
    if (!doubt) return res.status(404).json({ msg: "Doubt not found" });
    if (doubt.student.toString() !== req.user.id)
      return res.status(403).json({ msg: "Unauthorized" });
    if (doubt.status === "resolved")
      return res.status(400).json({ msg: "Cannot edit resolved doubt" });

    const updated = await Doubt.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Delete Doubt
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const doubt = await Doubt.findById(req.params.id);
    if (!doubt) return res.status(404).json({ msg: "Not found" });
    if (doubt.student.toString() !== req.user.id)
      return res.status(403).json({ msg: "Unauthorized" });

    await doubt.deleteOne();
    res.json({ msg: "Doubt deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Mark as resolved — only mentor can do this
router.put("/:id/resolve", authMiddleware, isMentor, resolveDoubt);

// Get all doubts — mentor only
router.get("/", authMiddleware, isMentor, getAllDoubts);

// Get doubt by ID
router.get("/:id", authMiddleware, getDoubtById);

module.exports = router;
