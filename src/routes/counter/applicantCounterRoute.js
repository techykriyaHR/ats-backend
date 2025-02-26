const express = require('express')
const router = express.Router();
const applicantCounterController = require('../../controllers/counter/applicantCounterController')


router.get("/", applicantCounterController.getApplicantCount)
router.get("/:filter", applicantCounterController.filterApplicantCount)

module.exports = router;