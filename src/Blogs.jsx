import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    console.log("✅ Fetching from:", `${API_URL}/api/blogs`);

    axios.get(`${API_URL}/api/blogs`)
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

  const handleToggle = () => {
    setActiveIndex((prev) => (prev === blogs.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Blog List</h1>
      {loading && <p className="text-blue-500">Loading blogs...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {blogs.length > 0 ? (
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 text-center">
          <h2 className="text-2xl font-semibold mb-4">{blogs[activeIndex].title}</h2>
          <button
            onClick={handleToggle}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Next Blog
          </button>
        </div>
      ) : (
        !loading && <p>No blogs available</p>
      )}
    </div>
  );
}
