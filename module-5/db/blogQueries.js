const Blog = require('../models/Blog');

// Returns created blog
async function createBlog(data) {
  return await Blog.create(data);
}

async function getAllBlogs() {
  return await Blog.find().populate('user', 'name email');
}

async function getBlogById(id) {
  return await Blog.findById(id).populate('user', 'name email');
}

async function updateBlog(id, data) {
  return await Blog.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
}

async function deleteBlog(id) {
  return await Blog.findByIdAndDelete(id);
}

module.exports = {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
};



