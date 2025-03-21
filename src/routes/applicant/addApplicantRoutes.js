const express = require("express")
require("dotenv").config()
const router = express.Router();

const addApplicantController = require("../../controllers/applicant/addApplicantController")

// applicants/add/
router.post("/", addApplicantController.addApplicant);

// applicants/add/upload
router.post("/upload", addApplicantController.uploadApplicants);

//applicants/add/check-duplicates
router.post("/check-duplicates", addApplicantController.checkDuplicates);

//applicants/check-if-blacklisted
router.post("/check-if-blacklisted", addApplicantController.checkIfBlacklisted); 


module.exports = router;