const express = require("express");
const router = express.Router();

const emailController = require("../../controllers/email/emailController");

router.post("/applicant", emailController.emailApplicant);

module.exports = router;