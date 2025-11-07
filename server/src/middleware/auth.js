const jwt = require('jsonwebtoken');
module.exports = function auth(req, _res, next) {
  const h = req.headers.authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : null;
  if (!token) return _res.status(401).json({ message: 'Missing token' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'testsecret');
    req.user = { id: payload.id };
    next();
  } catch {
    return _res.status(401).json({ message: 'Invalid token' });
  }
};
