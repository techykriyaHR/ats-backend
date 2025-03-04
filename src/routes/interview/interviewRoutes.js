const express = require("express");
const router = express.Router();
const interviewController = require("../../controllers/interview/interviewController");


// /interview - post
router.post('/', interviewController.addInterview);

// /interview - get
router.get('/', interviewController.getInterview)

//router.route('/').get(interviewController.getInterview).post(interviewController.addInterview);
router.put('/', interviewController.editInterview);

module.exports = router;