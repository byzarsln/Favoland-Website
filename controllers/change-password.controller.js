const path = require("path");
const User = require("../models/user.model");

const getChangePasswordPage = (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "change-password.html"));
};

const updatePassword = async (req, res) => {
  const { _id, oldPassword, newPassword, confirmPassword } = req.body;

  try {
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify the old password
    if (oldPassword !== user.password) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // Check if the new password is the same as the old password
    if (oldPassword === newPassword) {
      return res.status(400).json({
        message: "New password must be different from the old password",
      });
    }

    // Check if the new password and confirm password match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Update the password
    user.password = newPassword;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  getChangePasswordPage,
  updatePassword,
};
