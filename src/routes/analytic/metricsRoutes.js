const express = require("express");
const router = express.Router();

const metricsController = require("../../controllers/analytic/metricsController");

router.get('/', metricsController.getMetrics);

module.exports = router;