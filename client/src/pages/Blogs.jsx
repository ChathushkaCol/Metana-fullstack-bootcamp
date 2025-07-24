import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    axios.get('/api/blogs').then(res => setBlogs(res.data));
  }, []);

  return (
    <div>
      <h1>Blogs</h1>
      <ul>
        {blogs.map(blog => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  );
}
