const express = require("express");
const Fact = require("../models/Fact");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const facts = await Fact.find();
    res.json(facts);
  } catch (err) {
    res.json({ message: err });
  }
  res.send("api result");
});

router.post("/", async (req, res) => {
  console.log(req.body);
  const fact = new Fact(
    {
      fact: req.body.fact,
      category: req.body.category,
      lang: req.body.lang,
    },
    { versionKey: false }
  );

  try {
    const newFact = await fact.save();
    res.status(200).json(newFact);
  } catch (err) {
    res.json({ message: err });
  }
});

router.get("/fact", async (req, res) => {
  try {
    const fact = await Fact.findById(req.query.factId);
    res.send(fact);
  } catch (err) {
    console.log(err);
    res.send({ message: err });
  }
});

router.get("/all", async (req, res) => {
  try {
    let fact = await Fact.find();

    if (req.query.lang && req.query.category) {
      fact = await Fact.find({
        lang: req.query.lang,
        category: req.query.category,
      });
    } else if (req.query.lang) {
      fact = await Fact.find({ lang: req.query.lang });
    } else if (req.query.category) {
      fact = await Fact.find({ category: req.query.category });
    } else {
      fact = await Fact.find();
    }

    res
      .status(200)
      .json([{ code: 200 }, { count: fact.length }, { facts: fact }]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
});

module.exports = router;
