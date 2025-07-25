import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use environment variable or fallback to Render URL
  const API_URL = import.meta.env.VITE_API_URL || "https://metana-fullstack-bootcamp-1-mf01.onrender.com";

  useEffect(() => {
    axios.get(`${API_URL}/api/blogs`)
      .then((res) => {
        setBlogs(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching blogs:", err);
        setError("Failed to load blogs. Please try again later.");
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>Blog List</h1>

      {loading && <p style={{ textAlign: "center" }}>Loading blogs...</p>}
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      <ul style={{ listStyleType: "none", padding: 0 }}>
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <li key={blog._id} style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
              <h3 style={{ margin: "0 0 5px" }}>{blog.title}</h3>
              <p style={{ margin: "0", color: "#666" }}>{blog.content || "No content available"}</p>
            </li>
          ))
        ) : (
          !loading && <p style={{ textAlign: "center" }}>No blogs found.</p>
        )}
      </ul>
    </div>
  );
}
