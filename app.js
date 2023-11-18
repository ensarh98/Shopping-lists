var express = require("express");
var createError = require("http-errors");
var path = require("path");
var bodyParser = require("body-parser");

var shoppingListsRouter = require("./routes/shopping-lists");

require("dotenv").config();
var app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());

app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    extended: false,
    limit: "50mb",
  })
);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.use("/shopping-lists", shoppingListsRouter);

app.set("view engine", "ejs");
app.disable("etag");

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server radi na portu ${port}`);
});

module.exports = app;
