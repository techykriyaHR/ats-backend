const express = require("express");
const router = express.Router();
const multer = require("multer");

const storage = multer.memoryStorage(); // Store file in memory
const upload = multer({ storage });

const emailController = require("../../controllers/email/emailController");

router.post("/applicant", emailController.emailApplicant);

router.post("/applicant/with-file", upload.single('file') , emailController.emailApplicantWithFile);

module.exports = router;