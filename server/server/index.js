import express from "express";
import cors from "cors";

const app = express(); // ✅ app declared first
app.use(cors());
app.use(express.json());

// ✅ Test route
app.get("/api/blogs", (req, res) => {
  res.json([
    { id: 1, title: "First Blog" },
    { id: 2, title: "Second Blog" }
  ]);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
