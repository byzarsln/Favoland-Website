const path = require("path");
const User = require("../models/user.model");

const getSigninPage = (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "signin.html"));
};

const postSignin = async (req, res) => {
  const { username, password } = req.body;

  try {
    // find user
    const user = await User.findOne({ username });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // user is authenticated
    // remove password from the user object before sending
    user.password = undefined;
    user.savedCreditCards = undefined;
    return res
      .status(200)
      .json({ message: "You signed in successfully", user });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  getSigninPage,
  postSignin,
};
