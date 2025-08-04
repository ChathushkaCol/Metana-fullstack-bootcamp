import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Load API URL from Vite environment variable
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    console.log("✅ Fetching from:", API_URL); // Debugging log

    if (!API_URL) {
      setError("API URL is not set!");
      setLoading(false);
      return;
    }

    axios
      .get(`${API_URL}/api/blogs`) // ✅ Append /api/blogs only here
      .then((res) => {
        setBlogs(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching blogs:", err);
        setError("Failed to load blogs");
        setLoading(false);
      });
  }, [API_URL]);

  return (
    <div>
      <h1>Blog List</h1>
      {loading && <p>Loading blogs...</p>}
