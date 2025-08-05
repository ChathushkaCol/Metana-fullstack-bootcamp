import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Use Vercel env variable (or local during dev)
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    console.log("✅ Fetching from:", API_URL);

    if (!API_URL) {
      setError("API URL is not set");
      setLoading(false);
      return;
    }

    axios
      .get(`${API_URL}/api/blogs`) // ✅ Always use full URL
      .then((res) => {
        setBlogs(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
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
          blogs.map((blog) => <li key={blog.id}>{blog.title}</li>)
        ) : (
          !loading && <p>No blogs available</p>
        )}
      </ul>
    </div>
  );
}
