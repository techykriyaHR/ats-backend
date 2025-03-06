const express = require("express");
const router = express.Router();

const graphsController = require("../../controllers/analytic/graphsController");

router.get('/source', graphsController.source);
router.get('/requisition', graphsController.requisition);

module.exports = router;