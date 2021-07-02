const express = require("express");
const Fact = require("../models/Fact");
const User = require("../models/User");
const router = express.Router();

const dailyQuota = 42;

const isApiTokenValid = async (apiToken, res) => {
  try {
    const user = await User.findById(apiToken);

    if (user.dailyRequest < dailyQuota) {
      user.dailyRequest++;
      user.save();
      return true;
    }

    res.send(
      JSON.stringify({ message: "You exceeded your daily quota." }, null, 2)
    );
  } catch (err) {
    res.send(
      JSON.stringify({ message: "API token authentication failed." }, null, 2)
    );
  }
};

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
    res.send(JSON.stringify({ message: err }, null, 2));
  }
});

router.get("/fact", async (req, res) => {
  res.header("Cache-Control", "no-cache, no-store, must-revalidate");
  res.header("Content-Type", "application/json");
  const validateApiToken = await isApiTokenValid(req.query.apiToken);

  if (validateApiToken) {
    try {
      const fact = await Fact.findById(req.query.factId);
      res.send(JSON.stringify(fact, null, 2));
    } catch (err) {
      res.status(404).send(JSON.stringify({ message: err }, null, 2));
    }
  }
});

router.get("/all", async (req, res) => {
  res.header("Cache-Control", "no-cache, no-store, must-revalidate");
  res.header("Content-Type", "application/json");

  const validateApiToken = await isApiTokenValid(req.query.apiToken, res);

  if (validateApiToken) {
    try {
      let conditions = req.query;
      delete conditions["apiToken"]; // delete api token to search items
      let fact = await Fact.find(conditions);

      const response = { count: fact.length, facts: fact };

      res.status(200).send(JSON.stringify(response, null, 2));
    } catch (err) {
      res.send(JSON.stringify({ message: err }, null, 2));
    }
  }
});

module.exports = router;
