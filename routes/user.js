const express = require("express");
const { ensureAuthenticated } = require("../config/auth");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const router = express.Router();

router.get("/", ensureAuthenticated, async (req, res) => {
  res.render("user");
});

router.post("/", async (req, res) => {
  const { email, name } = req.body;
  let errors = [];

  if (!email || !name) {
    errors.push({ msg: "Please fill all the fields" });
  }

  if (errors.length > 0) {
    res.render("user", { errors });
  } else {
    try {
      const user = await User.findByIdAndUpdate(
        { _id: req.user.id },
        { email: email, name: name }
      );

      console.log(user);
      res.redirect("/user");
    } catch (err) {
      console.log(err);
    }
  }
});

router.post("/change-password", async (req, res) => {
  const { old, password, confirmation } = req.body;
  let errors = [];

  if (!password || !confirmation) {
    errors.push({ msg: "Please fill all the fields" });
  }

  if (password !== confirmation) {
    errors.push({ msg: "Passwords must match" });
  }

  const user = await User.findById(req.user.id);
  const isOldPasswordCorrect = bcrypt.compareSync(password, user.password); // when i type 'passworrd' and the password is 'password' it says it is true.

  console.log(isOldPasswordCorrect);

  if (isOldPasswordCorrect === false) {
    errors.push({ msg: "your current password is wrong" });
  }

  if (errors.length > 0) {
    console.log("errors");
    res.render("user", { errors });
  }

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) throw err;
      user.password = hash;
      user
        .save()
        .then((user) => {
          req.flash("success_msg", "Password updated");
          res.redirect("/user");
        })
        .catch((err) => console.log(err));
    });
  });
});
module.exports = router;

// bcrypt.genSalt(10, (err, salt) => {
//   bcrypt.hash(newUser.password, salt, (err, hash) => {
//     if (err) throw err;
//     user.password = hash;
//     user
//       .save()
//       .then((user) => {
//         req.flash("success_msg", "Password updated");
//         res.redirect("/user");
//       })
//       .catch((err) => console.log(err));
//   });
// });
