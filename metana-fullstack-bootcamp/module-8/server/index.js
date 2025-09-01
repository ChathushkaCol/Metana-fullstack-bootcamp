const blogs = [
  { id: 1, title: "React Basics", content: "This is a blog about React." },
  { id: 2, title: "Node.js Guide", content: "Learn about Node.js here." },
];

app.get("/api/blogs", (req, res) => {
  res.json(blogs);
});

app.get("/api/blogs/:id", (req, res) => {
  const blog = blogs.find((b) => b.id === parseInt(req.params.id));
  if (!blog) return res.status(404).send({ error: "Blog not found" });
  res.json(blog);
});

