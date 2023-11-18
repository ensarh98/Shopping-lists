const { Router } = require("express");
var router = Router();
const pool = require("../config/dbConfig");
require("dotenv").config();
const apiUrl = process.env.API_URL;

var shoppingListDetails = {
  getListDetails: function (req, res, next) {
    pool.connect(function (err, client, done) {
      if (err) {
        return res.send(err);
      }
      var listId = req.params.listId;
      client.query(
        `SELECT
        sl.list_id,
        sl.list_name,
        CONCAT(c.first_name, ' ', c.last_name) AS customer_name
        FROM shopping_lists sl
        JOIN customers c ON sl.customer_id = c.customer_id
        WHERE sl.list_id = $1;`,
        [listId],
        function (err, result) {
          done();
          if (err) {
            return res.send(err.stack);
          } else {
            res.render("shopping-list-details", {
              listDetails: result.rows,
              availableItems: req.availableItems,
              listItems: req.listItems,
              apiUrl: apiUrl,
              title: "Shopping list details",
            });
          }
        }
      );
    });
  },
  getAvailableItems: function (req, res, next) {
    pool.connect(function (err, client, done) {
      if (err) {
        return res.send(err);
      }
      var listId = req.params.listId;
      client.query(
        `select i.*,
        case when (select d.number_items from (select sli.item_id, count(*) as number_items from shopping_list_items sli where sli.list_id != $1 group by sli.item_id) d where d.item_id = i.item_id) >= 3 then false else true end as available 
        from items i
        order by i.item_name ASC`,
        [listId],
        function (err, result) {
          done();
          if (err) {
            return res.send(err.stack);
          } else {
            req.availableItems = result.rows;
            next();
          }
        }
      );
    });
  },
  getListItems: function (req, res, next) {
    pool.connect(function (err, client, done) {
      if (err) {
        return res.send(err);
      }
      var listId = req.params.listId;
      client.query(
        `SELECT sli.list_item_id, sli.item_id, i.item_name, i.price, sli.quantity
        FROM shopping_list_items sli
        JOIN items i ON sli.item_id = i.item_id
        WHERE sli.list_id = $1
        ORDER BY sli.list_item_id ASC;
        `,
        [listId],
        function (err, result) {
          done();
          if (err) {
            return res.send(err.stack);
          } else {
            req.listItems = result.rows;
            next();
          }
        }
      );
    });
  },
  setItem: function (req, res, next) {
    pool.connect(function (err, client, done) {
      if (err) {
        return res.send(err);
      }
      var listId = req.params.listId;
      var itemId = req.params.itemId;

      client.query(
        `INSERT INTO shopping_list_items (list_id, item_id, quantity)
        VALUES ($1, $2, 1)
        ON CONFLICT (list_id, item_id) DO UPDATE
        SET quantity = shopping_list_items.quantity + 1
        RETURNING *;`,
        [listId, itemId],
        function (err, result) {
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
  removeItem: function (req, res, next) {
    pool.connect(function (err, client, done) {
      if (err) {
        return res.send(err);
      }
      var listId = req.params.listId;
      var itemId = req.params.itemId;

      client.query(
        `update shopping_list_items 
        set quantity = case when quantity > 0 then quantity-1 else 0 end
        where list_id =$1 and item_id = $2`,
        [listId, itemId],
        function (err, result) {
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
  deleteItem: function (req, res, next) {
    pool.connect(function (err, client, done) {
      if (err) {
        return res.send(err);
      }
      var listId = req.params.listId;
      var itemId = req.params.itemId;

      client.query(
        `delete from shopping_list_items 
       where list_id = $1 and item_id = $2`,
        [listId, itemId],
        function (err, result) {
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

router.get(
  "/:listId",
  shoppingListDetails.getAvailableItems,
  shoppingListDetails.getListItems,
  shoppingListDetails.getListDetails
);

router.get(
  "/:listId/add/:itemId",
  shoppingListDetails.setItem,
  shoppingListDetails.getAvailableItems,
  shoppingListDetails.getListItems,
  shoppingListDetails.getListDetails
);

router.get(
  "/:listId/remove/:itemId",
  shoppingListDetails.removeItem,
  shoppingListDetails.getAvailableItems,
  shoppingListDetails.getListItems,
  shoppingListDetails.getListDetails
);

router.get(
  "/:listId/delete/:itemId",
  shoppingListDetails.deleteItem,
  shoppingListDetails.getAvailableItems,
  shoppingListDetails.getListItems,
  shoppingListDetails.getListDetails
);

module.exports = router;
