const router = require('express').Router();
const { login } = require('../controllers/auth.controller');
const auth = require('../middleware/auth');

router.post('/login', login);
router.get('/me', auth, (req, res) => res.json({ id: req.user.id }));

module.exports = router;
