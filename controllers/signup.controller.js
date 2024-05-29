const User = require("../models/user.model");
const path = require("path");

const getSignupPage = (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "signup.html"));
};

const postSignup = async (req, res) => {
  const { username, password } = req.body;

  try {
    // check existing user
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(409).json({ message: "Username already exists" }); // Conflict
    }

    // create new user
    const user = new User({ username, password });
    await user.save();

    res.status(201).json({ message: "You signed up successfully" }); // Created
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" }); // Internal Server Error
  }
};

module.exports = {
  getSignupPage,
  postSignup,
};
