const express = require('express')
const router = express.Router()
const AuthController = require('../controllers/AuthController')

router.get('/login', AuthController.login)
router.get('/privacy', AuthController.privacy)
router.post('/login', AuthController.loginPost)
router.post('/loginGoogle', AuthController.loginGooglePost)
router.get('/register', AuthController.register)
router.post('/register', AuthController.registerPost)
router.get('/logout', AuthController.logout)

module.exports = router