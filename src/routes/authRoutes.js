const { Router } = require('express');
const authController = require('../controllers/authController');

const router = Router();

router.get('/login', authController.showLogin);
router.post('/login', authController.login);
router.get('/register', authController.showRegister);
router.post('/register', authController.register);
router.get('/logout', authController.logout);

module.exports = router;
