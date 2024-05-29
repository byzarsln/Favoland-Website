const express = require("express");
const router = express.Router();

const {
  deleteReservation,
} = require("../controllers/delete-reservation.controller");

router.delete("/:reservationId", deleteReservation);

module.exports = router;
