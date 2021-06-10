const bodyParser = require("body-parser");
const path = require("path");
const express = require("express");
const body = require("body-parser");
const expressLayouts = require("express-ejs-layouts");
const app = express();
const mongoose = require("mongoose");
require("dotenv/config");

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

// import routes
const apiRoute = require("./routes/api");
const docsRoute = require("./routes/docs");
const loginRoute = require("./routes/sign-in");

app.use("/api", apiRoute);
app.use("/docs", docsRoute);
app.use("/", loginRoute);

app.get("/", (req, res) => {
  res.render("home");
  // res.send("home");
});

const PORT = 3000;

app.listen(PORT);
