var express = require("express");
var createError = require("http-errors");
var path = require("path");
var bodyParser = require("body-parser");

var shoppingListsRouter = require("./routes/shopping-lists");
var shoppingListDetailsRouter = require("./routes/shopping-list-details");

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

app.use("/", shoppingListsRouter);
app.use("/details", shoppingListDetailsRouter);

app.set("view engine", "ejs");
app.disable("etag");

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).render("error", { error: err });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server start on port ${port}`);
});

module.exports = app;
