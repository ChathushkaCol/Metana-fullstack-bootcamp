import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Use your Render backend URL here (NOT /api/blogs)
  const API_URL = "https://metana-fullstack-bootcamp-1-mf01.onrender.com/api/blogs";

  useEffect(() => {
    axios.get(API_URL)
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
            <li key={blog._id}>{blog.title}</li>
          ))
        ) : (
          !loading && <p>No blogs found</p>
        )}
      </ul>
    </div>
  );
}
