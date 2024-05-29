const path = require("path");
const User = require("../models/user.model");

const getSavedCards = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).send("User not found");
      return;
    }

    res.status(200).json(user.savedCreditCards);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  getSavedCards,
};
