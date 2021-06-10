const express = require("express");
const Fact = require("../models/Fact");

const router = express.Router();

router.get("/login", async (req, res) => {
  //   res.render("login.ejs");
  res.render("login", { layout: "login" });
});

module.exports = router;
