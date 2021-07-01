const express = require("express");
const { ensureAuthenticated } = require("../config/auth");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const router = express.Router();

router.get("/", ensureAuthenticated, async (req, res) => {
  res.render("user", { title: "Profile" });
});

router.get("/delete", ensureAuthenticated, async (req, res) => {
  await User.findByIdAndDelete(req.user.id);
  req.flash("success_msg", "Account Deleted");
  res.redirect("/login");
});

router.post("/", async (req, res) => {
  const { email, name } = req.body;
  const user = await User.findOne({ email: email });
  let errors = [];

  if (!email || !name) {
    errors.push({ msg: "Please fill all the fields" });
  }

  if (user && req.user.email !== email) {
    errors.push({ msg: "Email already exists" });
  }

  if (errors.length > 0) {
    res.render("user", { errors });
  } else {
    try {
      await User.findByIdAndUpdate(
        { _id: req.user.id },
        { email: email, name: name }
      );

      res.redirect("/user");
    } catch (err) {
      console.log(err);
    }
  }
});

router.get("/security", ensureAuthenticated, (req, res) => {
  res.render("security", { title: "Profile" });
});

router.post("/security", async (req, res) => {
  const { old, password, confirmation } = req.body;
  let errors = [];

  if (!password || !confirmation) {
    errors.push({ msg: "Please fill all the fields" });
  }

  if (password !== confirmation) {
    errors.push({ msg: "Passwords must match" });
  }

  const user = await User.findById(req.user.id);
  const isOldPasswordCorrect = bcrypt.compareSync(old, user.password); // when i type 'passworrd' and the password is 'password' it says it is true.

  if (isOldPasswordCorrect === false) {
    errors.push({ msg: "your current password is wrong" });
  }

  if (errors.length > 0) {
    res.render("security", { errors: errors, title: "Security" });
  } else {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) throw err;
        user.password = hash;
        user
          .save()
          .then((user) => {
            req.flash("success_msg", "Password updated");
            res.redirect("/user/security");
          })
          .catch((err) => console.log(err));
      });
    });
  }
});

router.get("/api-key", ensureAuthenticated, (req, res) => {
  res.render("api-key", { title: "API key" });
});

module.exports = router;
