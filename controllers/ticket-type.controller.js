const TicketType = require("../models/ticket-type.model");

const getTicketTypes = async (req, res) => {
  try {
    const ticketTypes = await TicketType.find();
    res.status(200).json(ticketTypes);
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = {
  getTicketTypes,
};
