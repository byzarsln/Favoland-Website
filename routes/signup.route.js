const express = require("express");
const router = express.Router();
const {
  getSignupPage,
  postSignup,
} = require("../controllers/signup.controller");

router.get("/", getSignupPage);
router.post("/", postSignup);

module.exports = router;
