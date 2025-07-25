import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("API running...");
});

// Example API route
app.get("/api/blogs", (req, res) => {
  res.json([
    { id: 1, title: "First Blog" },
    { id: 2, title: "Second Blog" }
  ]);
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
