import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios
      .get(`${API_URL}/api/blogs`)
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

  const handleToggle = () =>
    setActiveIndex((i) => (blogs.length ? (i + 1) % blogs.length : 0));

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-6">
          Blog List
        </h1>

        {loading && <p className="text-blue-600">Loading blogs...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {blogs.length > 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold">{blogs[activeIndex].title}</h2>
            <button
              onClick={handleToggle}
              className="mt-5 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 active:scale-[.98] transition"
            >
              Next Blog
            </button>
          </div>
        ) : (
          !loading && <p>No blogs available</p>
        )}
      </div>
    </div>
  );
}
