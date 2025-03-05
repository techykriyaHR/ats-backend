const express = require("express")
require("dotenv").config()
const router = express.Router();
const editApplicantController = require('../../controllers/applicant/editApplicantController.js')

router.put("/", editApplicantController.editApplicant)

module.exports = router;