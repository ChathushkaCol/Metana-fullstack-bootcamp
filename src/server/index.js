const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
require("dotenv").config();

const authRouter = require("./routes/authRouter");
const blogsRouter = require("./routes/blogsRouter");
const userRouter = require("./routes/userRouter");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/blogs", blogsRouter);
app.use("/api/users", userRouter);

app.get("/", (req, res) => {
  res.send("✅ API is working! Try /api/auth or /api/blogs");
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));




