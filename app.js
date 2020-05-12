const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const app = express();
const configRoutes = require("./routes");
const path = require("path");
const static = express.static(__dirname + "/public");

app.use("/", static);

app.use(
  session({
    name: "session",
    secret: "This is a secret.. shhh don't tell anyone",
    saveUninitialized: true,
    resave: false,
  })
);

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

configRoutes(app);

app.use(function (err, req, res, next) {
  try {
    res.render("." + req.url, {
      hasErrors: true,
      errors: [err.message],
    });
  } catch (e) {
    res.status(500).send(err);
  }
});

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
