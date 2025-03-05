const express = require("express")
require("dotenv").config()
const router = express.Router();

const registerController = require("../../controllers/auth/registerController");

router.post('/register', registerController.register);

module.exports = router;