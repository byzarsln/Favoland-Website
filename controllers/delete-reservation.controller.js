const User = require("../models/user.model");

const deleteReservation = async (req, res) => {
  const { userId } = req.body;
  const { reservationId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).send("User not found");
      return;
    }

    const reservationIndex = user.reservations.findIndex(
      (reservation) => reservation._id.toString() === reservationId
    );

    if (reservationIndex === -1) {
      res.status(404).send("Reservation not found");
      return;
    }

    user.reservations.splice(reservationIndex, 1);

    try {
      await user.save();
      res.status(200).send(user);
    } catch (err) {
      res.status(500).send(err);
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = {
  deleteReservation,
};
