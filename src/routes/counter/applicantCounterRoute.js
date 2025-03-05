const express = require('express')
const router = express.Router();
const applicantCounterController = require('../../controllers/counter/applicantCounterController')

//counts all 
router.get("/", applicantCounterController.getApplicantCount)

router.get("/try", applicantCounterController.tryAPI)

module.exports = router;