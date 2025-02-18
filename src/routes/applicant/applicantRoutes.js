const express = require("express");
const router = express.Router();
const applicantController = require("../../controllers/applicant/applicantController")

//gets all applicants
router.get("/:company_id/", applicantController.getAllApplicants)

//we will receive an object literal from the frontend that describes the filter
router.get("/:company_id/filter/", applicantController.getApplicantsFilter)

//gets a specific applicant
router.get("/:company_id/:applicant_id", applicantController.getApplicants);




module.exports = router;