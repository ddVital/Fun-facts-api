const path = require("path");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const passport = require("passport");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const cron = require("node-cron");

require("dotenv/config");

const app = express();

// Passport Config
require("./config/passport")(passport);

// import routes
const apiRoute = require("./routes/api");
const docsRoute = require("./routes/docs");
const loginRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const User = require("./models/User");
const Fact = require("./models/Fact");

// Static
app.use(express.static(path.join(__dirname, "public")));

// EJS
app.use(expressLayouts);
app.set("view engine", "ejs");
// app.set("layout", false);
app.set("layout login", false);

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// connect to db
mongoose
  .connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("DB Connected..."))
  .catch((err) => console.log(err));

// Express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function (req, res, next) {
  res.locals.user = req.user;
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

app.use("/api", apiRoute);
app.use("/docs", docsRoute);
app.use("/user", userRoute);
app.use("/", loginRoute);

app.get("/", async (req, res) => {
  const fact = await Fact.aggregate([{ $sample: { size: 1 } }]);
  res.render("home", { fact: fact[0].fact });
});

cron.schedule("0 0 0 * * *", async () => {
  console.log("Daily Quota reset!");
  const users = await User.find();

  users.forEach((user) => {
    user.dailyRequest = 0;
    user.save();
  });
});

const PORT = 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("server is up and running already...");
});
