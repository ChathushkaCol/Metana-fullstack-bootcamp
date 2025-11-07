const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
    res.json({ message: "Register endpoint working" });
};

exports.loginUser = async (req, res) => {
    res.json({ message: "Login endpoint working" });
};
