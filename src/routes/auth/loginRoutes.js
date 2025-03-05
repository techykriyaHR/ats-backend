const express = require("express")
require("dotenv").config()
const router = express.Router();

const loginController = require("../../controllers/auth/loginController");

router.post('/login', loginController.login);

module.exports = router;