const express = require("express");
const router = express.Router();

const { getTicketTypes } = require("../controllers/ticket-type.controller");

router.get("/", getTicketTypes);

module.exports = router;
