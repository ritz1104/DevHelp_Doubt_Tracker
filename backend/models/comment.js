const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    doubt: { type: mongoose.Schema.Types.ObjectId, ref: "Doubt", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
