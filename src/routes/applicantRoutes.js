const express = require("express");
const router = express.Router();
const applicantController = require("../controllers/applicantController")

router.get("/:company_id", applicantController.getApplicants);
//we will receive an object literal from the frontend that describes the filter
router.get("/:company_id/filter/", applicantController.getApplicantsFilter)

module.exports = router;