const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/auth');
const doubtRoutes = require('./routes/doubts');
const commentRoutes = require('./routes/comment');
const path = require("path");

// after your other `app.use(...)` calls:

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173', // frontend origin
    credentials: true, // if using cookies or sessions in future
  })
);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/doubts', doubtRoutes);
app.use("/api/comments", commentRoutes);

// Default route
app.get('/', (req, res) => res.send("DevHelp API Running"));

module.exports = app;
