const express = require("express");
const Fact = require("../models/Fact");

const router = express.Router();

router.get("/", async (req, res) => {
  res.render("docs", { url: req.get("host"), title: "Docs" });
});

module.exports = router;
