const path = require("path");
const User = require("../models/user.model");

const getNewReservationPage = (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "new-reservation.html"));
};

const addReservation = async (req, res) => {
  const {
    userId,
    ticketType,
    date,
    people,
    price,
    saveCard,
    cardName,
    cardNumber,
    expiryMonth,
    expiryYear,
    securityCode,
  } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).send("User not found");
      return;
    }

    // Check if the card name already exists
    const existingCardName = user.savedCreditCards.find(
      (card) => card.cardName === cardName
    );
    if (existingCardName) {
      res.status(400).json({ error: "A card with this name already exists" });
      return;
    }

    // Check if any card with the same details exists
    const existingCard = user.savedCreditCards.find(
      (card) =>
        card.cardNumber === cardNumber &&
        card.expiryMonth === expiryMonth &&
        card.expiryYear === expiryYear &&
        card.securityCode === securityCode
    );
    if (existingCard) {
      res.status(400).json({ error: "This card has already been saved" });
      return;
    }

    user.reservations.push({ ticketType, date, people, price });

    // If saveCard is true, save the credit card information
    if (saveCard) {
      if (cardName.length < 3) {
        res.status(400).json({ error: "Card name must be at least 3 characters long" });
        return;
      }
  
      user.savedCreditCards.push({
        cardName,
        cardNumber,
        expiryMonth,
        expiryYear,
        securityCode,
      });
    }

    try {
      await user.save();
      const createdReservation =
        user.reservations[user.reservations.length - 1];

      res.status(201).send({
        _id: createdReservation._id,
        ticketType: createdReservation.ticketType,
        date: createdReservation.date,
        people: createdReservation.people,
        price: createdReservation.price,
      });
    } catch (err) {
      res.status(500).send(err);
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = {
  getNewReservationPage,
  addReservation,
};
