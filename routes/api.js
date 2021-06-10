const express = require("express");
const Fact = require("../models/Fact");

const router = express.Router();

router.post("/create", async (req, res) => {
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
    console.log(err);
    res.json({ message: err });
  }
});

router.get("/fact", async (req, res) => {
  res.header("Cache-Control", "no-cache, no-store, must-revalidate");
  res.header("Content-Type", "application/json");

  try {
    const fact = await Fact.findById(req.query.factId);
    res.send(JSON.stringify(fact, null, 2));
  } catch (err) {
    if (err.name === "CastError") {
      res.status(404).send({ message: "not found..." });
    }
    res.status(400).send({ message: err });
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

    const response = {
      count: fact.length,
      facts: fact,
    };

    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Content-Type", "application/json");

    res.status(200).send(JSON.stringify(response, null, 2));
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
});

module.exports = router;
