const Comment = require("../models/comment");
const Doubt = require("../models/doubt");


const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const doubtId = req.params.id;

    if (!text) return res.status(400).json({ message: "Text is required" });

    const doubt = await Doubt.findById(doubtId);
    if (!doubt) return res.status(404).json({ message: "Doubt not found" });

    const comment = new Comment({
      text,
      createdBy: req.user.id,
      doubt: doubtId,
    });

    await comment.save();

    // Push comment to the doubt's comments array
    doubt.comments.push(comment._id);
    await doubt.save();

    res.status(201).json(comment);
  } catch (err) {
    console.error("Error adding comment:", err.message);
    res.status(500).json({ message: "Failed to add comment" });
  }
};



module.exports = { addComment };
