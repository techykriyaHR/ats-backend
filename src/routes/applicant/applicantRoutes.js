const express = require("express");
const router = express.Router();
const applicantController = require("../../controllers/applicant/applicantController")

//gets all applicants
router.get("/", applicantController.getAllApplicants)

//we will receive an object literal from the frontend that describes the filter
router.get("/filter", applicantController.getApplicantsFilter)

//gets a specific applicant
router.get("/:applicant_id", applicantController.getApplicant);


module.exports = router;