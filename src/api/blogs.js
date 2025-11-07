const API_BASE_URL = "https://metana-fullstack-bootcamp-1-mf01.onrender.com";

export const fetchBlogs = async () => {
  const response = await fetch(`${API_BASE_URL}/api/blogs`);
  return response.json();
};


