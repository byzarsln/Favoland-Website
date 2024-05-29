const express = require("express");
const router = express.Router();

const { getDashboardPage } = require("../controllers/dashboard.controller");

router.get("/", getDashboardPage);

module.exports = router;
