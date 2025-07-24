import axios from 'axios';

const API = 'http://localhost:3000/api/users';

export const getProfile = async (token) => {
  const res = await axios.get(`${API}/profile`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getAllUsers = async (token) => {
  const res = await axios.get(`${API}/all`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
