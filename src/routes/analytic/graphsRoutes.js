const express = require("express");
const router = express.Router();

const graphsController = require("../../controllers/analytic/graphsController");

// /analytic/graphs/source
router.get('/source', graphsController.source);

// /analytic/graphs/requisition
router.get('/requisition', graphsController.requisition);

// /analytic/graphs/application-trend
router.get('/application-trend', graphsController.applicationTrend); 

module.exports = router;