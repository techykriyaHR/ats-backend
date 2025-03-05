const express = require("express")
require("dotenv").config()
const router = express.Router();
const editApplicantController = require('../../controllers/applicant/editApplicantController.js')

router.post("/", editApplicantController.editApplicant)

module.exports = router;