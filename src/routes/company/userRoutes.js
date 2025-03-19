const express = require("express");
const router = express.Router();

const userController = require("../../controllers/company/userController");

// /company/users/ - fetch all users
router.get("/", userController.getUsers);



module.exports = router;