const express = require("express");
const router = express.Router();
const notificationController = require("../../controllers/notification/notificationController");

router.get("/", notificationController.getNotification);

module.exports = router;