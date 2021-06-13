const express = require("express");
const bcrypt = require("bcryptjs");
const passport = require("passport");
// Load User model
const User = require("../models/User");
const { forwardAuthenticated } = require("../config/auth");
const Fact = require("../models/Fact");

const router = express.Router();

router.get("/login", async (req, res) => {
  res.render("login", { openTab: "login", layout: "login" });
});

// Login Page
// router.get("/", forwardAuthenticated, (req, res) => res.render("login"));

// Register Page
router.get("/register", forwardAuthenticated, (req, res) =>
  res.render("login", { openTab: "register", layout: "login" })
);

// Register
router.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  let errors = [];

  if (!name || !email || !password) {
    errors.push({ msg: "Please enter all fields" });
  }

  if (password.length < 8) {
    errors.push({ msg: "Password must be at least 8 characters" });
  }

  if (errors.length > 0) {
    res.render(
      "login",
      {
        errors,
        name,
        email,
        password,
        openTab: "register",
      },
      { layout: "login" }
    );
  } else {
    User.findOne({ email: email }).then((user) => {
      if (user) {
        errors.push({ msg: "Email already exists" });
        res.render(
          "login",
          {
            errors,
            name,
            email,
            password,
            openTab: "register",
          },
          { layout: "login" }
        );
      } else {
        const newUser = new User({
          name,
          email,
          password,
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then((user) => {
                req.flash(
                  "success_msg",
                  "You are now registered and can log in"
                );
                res.redirect("/login");
              })
              .catch((err) => console.log(err));
          });
        });
      }
    });
  }
});

// Login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
});

// Logout
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/");
});

module.exports = router;
