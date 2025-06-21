const User = require('../models/User');

// Query functions return data only — not HTTP response
async function createUser(data) {
  return await User.create(data);
}

async function getAllUsers() {
  return await User.find();
}

async function getUserById(id) {
  return await User.findById(id);
}

async function updateUser(id, data) {
  return await User.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
}

async function deleteUser(id) {
  return await User.findByIdAndDelete(id);
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};

