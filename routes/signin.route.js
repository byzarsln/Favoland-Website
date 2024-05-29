const express = require("express");
const router = express.Router();
const {
  getSigninPage,
  postSignin,
} = require("../controllers/signin.controller");

router.get("/", getSigninPage);
router.post("/", postSignin);

module.exports = router;
