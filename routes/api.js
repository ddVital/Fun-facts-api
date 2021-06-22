const express = require("express");
const Fact = require("../models/Fact");
const User = require("../models/User");
const router = express.Router();

const dailyQuota = 42;

const isApiTokenValid = async (apiToken) => {
  try {
    const user = await User.findById(apiToken);

    if (user.dailyRequest < dailyQuota) {
      user.dailyRequest++;
      user.save();
      return true;
    }
    return false;
  } catch (err) {
    return false;
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
    console.log(err);
    res.json({ message: err });
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
      res.status(404).send({ message: err });
    }
  }

  res.send({ message: "API token authentication failed..." });
});

router.get("/all", async (req, res) => {
  res.header("Cache-Control", "no-cache, no-store, must-revalidate");
  res.header("Content-Type", "application/json");

  let conditions = req.query;
  const validateApiToken = await isApiTokenValid(req.query.apiToken);

  if (validateApiToken) {
    try {
      delete conditions["apiToken"]; // delete api token to search items
      let fact = await Fact.find(conditions);

      const response = { count: fact.length, facts: fact };

      res.status(200).send(JSON.stringify(response, null, 2));
    } catch (err) {
      res.send({ message: err });
    }
  }

  res.send({ message: "API token authentication failed..." });
});

module.exports = router;
