require('dotenv').config();

module.exports = {
  PG_URI: process.env.PG_URI,
  PORT: process.env.PORT || 3000,
};



