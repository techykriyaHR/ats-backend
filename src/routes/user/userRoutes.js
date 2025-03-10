const express = require("express");
require("dotenv").config();
const router = express.Router();

const userController = require("../../controllers/user/userController");
const verifyToken = require("../../middlewares/verifyToken");

router.get('/getuserinfo', verifyToken, userController.getUserInfo);

module.exports = router;