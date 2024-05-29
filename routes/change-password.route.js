const express = require("express");
const router = express.Router();

const {
  getChangePasswordPage,
  updatePassword,
} = require("../controllers/change-password.controller");

router.get("/", getChangePasswordPage);
router.put("/", updatePassword);

module.exports = router;
