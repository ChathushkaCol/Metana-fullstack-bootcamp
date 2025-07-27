import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Use full Render backend API URL
  const API_URL = "https://metana-fullstack-bootcamp-1-mf81.onrender.com/api/blogs";

  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => {
        setBlogs(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching blogs:", err);
        setError("Failed to load blogs");
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h1>Blog List</h1>
      {loading && <p>Loading blogs...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <li key={blog.id}>{blog.title}</li>
          ))
        ) : (
          !loading && <p>No blogs available</p>
        )}
      </ul>
    </div>
  );
}
