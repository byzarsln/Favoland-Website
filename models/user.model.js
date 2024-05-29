const mongoose = require("mongoose");

const ReservationsSchema = mongoose.Schema({
  ticketType: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  people: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const CreditCardSchema = mongoose.Schema({
  cardNumber: {
    type: String,
    required: true,
  },
  expiryMonth: {
    type: String,
    required: true,
  },
  expiryYear: {
    type: String,
    required: true,
  },
  securityCode: {
    type: String,
    required: true,
  },
  cardName: {
    type: String,
    required: true,
  },
});

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  reservations: {
    type: [ReservationsSchema],
    default: [],
  },
  savedCreditCards: {
    type: [CreditCardSchema],
    default: [],
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
