const mongoose = require('mongoose');
const connectToDB = require('../db/dbconn');
const User = require('../models/User');
const Blog = require('../models/Blog');

async function seed() {
  await connectToDB();
  await User.deleteMany();
  await Blog.deleteMany();

  const user = await User.create({ name: 'John Doe', email: 'john@example.com' });
  await Blog.create({ title: 'Hello Blog', content: 'Content here', user: user._id });

  console.log('✅ Seeded database');
  mongoose.disconnect();
}

seed();
