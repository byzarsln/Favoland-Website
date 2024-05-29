const express = require("express");
const router = express.Router();

const {
  getNewReservationPage,
  addReservation,
} = require("../controllers/new-reservation.controller");

router.get("/", getNewReservationPage);
router.post("/", addReservation);

module.exports = router;
