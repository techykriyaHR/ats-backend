const express = require("express")
require("dotenv").config()
const router = express.Router();
const statusController = require('../../controllers/status/statusController')


router.get('/', statusController.getStatus);

module.exports = router;