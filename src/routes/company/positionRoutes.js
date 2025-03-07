const express = require("express");
const router = express.Router();

const positionController = require("../../controllers/company/positionController");

// /company/positions
router.get("/positions", positionController.getPositions);

module.exports = router;