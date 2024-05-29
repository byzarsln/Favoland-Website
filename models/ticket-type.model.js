const mongoose = require("mongoose");

const ticketTypeSchema = new mongoose.Schema({
  type: String,
  basePrice: Number,
  description: String,
});

const TicketType = mongoose.model("Ticket_Type", ticketTypeSchema);

module.exports = TicketType;
