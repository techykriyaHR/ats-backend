const express = require("express")
require("dotenv").config()
const router = express.Router();

const updateApplicantStatus = require("../../controllers/applicant/updateStatusController")

router.put("/", updateApplicantStatus.updateApplicantStatus);

module.exports = router;