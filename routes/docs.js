const express = require("express");
const Fact = require("../models/Fact");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const facts = await Fact.find();
    // res.json(facts);
    res.render("docs");
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
