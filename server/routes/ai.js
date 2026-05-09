const express = require("express");
const router = express.Router();
const aiControllers = require("../controllers/shared/aiControllers");

router.post('/chat',aiControllers);

module.exports = router;