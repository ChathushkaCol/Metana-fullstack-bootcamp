import axios from "axios";

const API_BASE = "/api/blogs";

export const getBlogs = async () => {
  const res = await axios.get(API_BASE);
  return res.data;
};

export const getBlogById = async (id) => {
  const res = await axios.get(`${API_BASE}/${id}`);
  return res.data;
};

