import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);

  // ✅ Use your Render backend URL
  const API_URL = "https://metana-fullstack-bootcamp-1-mf01.onrender.com/api/blogs";

  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => setBlogs(res.data))
      .catch((err) => console.error("Error fetching blogs:", err));
  }, []);

  return (
    <div>
      <h1>Blog List</h1>
      <ul>
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <li key={blog.id}>{blog.title}</li>
          ))
        ) : (
          <p>No blogs found or loading...</p>
        )}
      </ul>
    </div>
  );
}
