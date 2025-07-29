import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get("/api/blogs")
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
          blogs.map((blog) => <li key={blog.id}>{blog.title}</li>)
        ) : (
          !loading && <p>No blogs available</p>
        )}
      </ul>
    </div>
  );
}
