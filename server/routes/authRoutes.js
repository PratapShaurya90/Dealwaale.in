const express = require("express")
const router = express.Router();
const { register, login, getUserById, refreshToken, getProfile, updateProfile } = require('../controllers/shared/authee')
const { protect } = require('../middlewares/protect')

router.post('/register', register)
router.post('/login', login)
router.post('/refresh', refreshToken)
router.get('/profile', protect, getProfile)
router.put('/profile', protect, updateProfile)
router.get('/:id', getUserById)

module.exports = router