const express = require("express");
const { addComment } = require("../controllers/commentController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/:id", authMiddleware, addComment);

module.exports = router;

