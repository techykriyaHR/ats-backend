const express = require("express");
const router = express.Router();
const multer = require("multer");

const storage = multer.memoryStorage(); // Store file in memory
const upload = multer({ storage });

const emailController = require("../../controllers/email/emailController");

router.post("/applicant", emailController.emailApplicant);

router.post("/applicant/with-files", upload.array('files', 10) , emailController.emailApplicantWithFiles);

module.exports = router;