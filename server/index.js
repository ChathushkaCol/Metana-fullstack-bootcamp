// server/index.js
import express from "express";
import cors from "cors";

const app = express();                // ✅ create app FIRST

app.use(cors());
app.use(express.json());

// health check (optional)
app.get("/", (_req, res) => {
  res.send("API running...");
});

// example API
app.get("/api/blogs", (_req, res) => {
  res.json([
    { id: 1, title: "First Blog" },
    { id: 2, title: "Second Blog" },
  ]);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
