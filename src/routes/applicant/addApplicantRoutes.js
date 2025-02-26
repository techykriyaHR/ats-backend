const express = require("express")
require("dotenv").config()
const router = express.Router();

const addApplicantController = require("../../controllers/applicant/addApplicantController")

// applicant/add/
router.post("/", addApplicantController.addApplicant);

// applicant/add/upload
router.post("/upload", addApplicantController.uploadApplicants);

module.exports = router;