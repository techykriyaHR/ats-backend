const express = require("express")
require("dotenv").config()
const router = express.Router();

const updateApplicantStatus = require("../../controllers/applicant/updateApplicantStatusControllers")

router.get("/", updateApplicantStatus.updateApplicantStatus);

module.exports = router;