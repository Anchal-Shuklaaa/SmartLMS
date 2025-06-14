const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/smartlms")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

// Add these route imports
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/student', require('./routes/studentsRoutes'));

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
