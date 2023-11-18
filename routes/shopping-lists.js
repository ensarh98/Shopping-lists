const { Router } = require("express");
var router = Router();
const pool = require("../config/dbConfig");
require("dotenv").config();
const apiUrl = process.env.API_URL;

var shoppingLists = {
  getAll: function (req, res, next) {
    pool.connect(function (err, client, done) {
      if (err) {
        return res.send(err);
      }
      client.query(
        `SELECT sl.*, CONCAT(c.first_name, ' ', c.last_name) as customer
        FROM shopping_lists sl 
        JOIN customers c ON c.customer_id = sl.customer_id`,
        [],
        function (err, result) {
          done();
          if (err) {
            return res.send(err.stack);
          } else {
            res.render("shopping-lists", {
              lists: result.rows,
              customers: req.customers,
              apiUrl: apiUrl,
              title: "Shopping lists",
            });
          }
        }
      );
    });
  },
  getAvailableCustomers: function (req, res, next) {
    pool.connect(function (err, client, done) {
      if (err) {
        return res.send(err);
      }
      client.query(
        `SELECT c.customer_id, CONCAT(c.first_name, ' ', c.last_name) as name from customers c order by c.first_name ASC`,
        [],
        function (err, result) {
          done();
          if (err) {
            return res.send(err.stack);
          } else {
            req.customers = result.rows;
            next();
          }
        }
      );
    });
  },
  insert: function (req, res, next) {
    pool.connect(async function (err, client, done) {
      if (err) {
        return res.send(err);
      }
      var listName = req.body.listName;
      var customer_id = req.body.customer_id;
      client.query(
        `INSERT INTO shopping_lists
          (customer_id, list_name)
          VALUES($1, $2);
          `,
        [customer_id, listName],
        (err, result) => {
          done();
          if (err) {
            return res.send(err.stack);
          } else {
            next();
          }
        }
      );
    });
  },
};

router.get("/", shoppingLists.getAvailableCustomers, shoppingLists.getAll);
router.post(
  "/insert",
  shoppingLists.insert,
  shoppingLists.getAvailableCustomers,
  shoppingLists.getAll
);

module.exports = router;
