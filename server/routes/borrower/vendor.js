var express = require("express");
var router = express.Router();
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const verifyToken = require("../verifyToken");
const fileUpload = require("express-fileupload");
const fs = require("fs");
router.use(fileUpload());

let db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "de_rent",
});

// connect to database
db.connect();


/* GET vendors listing. */
router.get("/:id", verifyToken, async function (req, res, next) {
  try {
    var sql = `SELECT vendors.* FROM vendors WHERE vendors.id = ?`;
    await db.query(sql, [req.params.id], function (err, result) {
      (async () => {
        try{
          sql = `SELECT products.id,products.name
          FROM products 
          INNER JOIN vendors ON products.vendor_id=vendors.id
          WHERE
          vendors.id = ?
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
