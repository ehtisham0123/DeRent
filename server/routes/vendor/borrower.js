var express = require("express");
var router = express.Router();
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const verifyToken = require("../verifyToken");

let db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "de_rent",
});

// connect to database
db.connect();


/* GET borrowers listing. */
router.get("/:id", verifyToken, async function (req, res, next) {
  try {
    var sql = `SELECT borrowers.* FROM borrowers WHERE borrowers.id = ?`;
    await db.query(sql, [req.params.id], function (err, result) {
      (async () => {
        try{
          sql = `
          SELECT products.*
          FROM products
          WHERE products.id IN
          (SELECT enrollment.product_id
          FROM enrollment
          WHERE
          borrower_id = ?)
          `;
             await db.query(sql, [req.params.id], function (err, products) {         
               res.status(201).json({ result: result , products : products });
              });
        }catch (er) {
            console.log(err);
        }
        })();

      });
      } catch (er) {
      console.log(err);
    }

});


module.exports = router;
