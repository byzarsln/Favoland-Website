const express = require("express");
const router = express.Router();

const {
  getSavedCards,
} = require("../controllers/saved-credit-cards.controller");

router.get("/:userId", getSavedCards);

module.exports = router;
