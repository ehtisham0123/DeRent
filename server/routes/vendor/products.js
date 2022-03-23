var express = require("express");
var router = express.Router();
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const verifyToken = require("../verifyToken");
const fs = require("fs");

let db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "de_rent",
});

// connect to database
db.connect();



router.get("/hired-products/:id", verifyToken, async (req, res, next) => {
  try {
    sql = `SELECT borrowers.id,borrowers.firstname, borrowers.lastname,borrowers.email,borrowers.avatar
      FROM borrowers
      WHERE borrowers.id IN
      (SELECT enrollment.borrower_id
      FROM enrollment
      WHERE
      product_id = ?) 
  `;
    db.query(sql, [req.params.id], function (err, result) {
      res.status(201).json({ result: result });
    });
  } catch (er) {
    console.log(err);
  }
});

/* GET products listing. */
router.get("/:name?", verifyToken, async (req, res, next) => {
  let category = req.query.category;  
  if (req.params.name) {
    if (category == 'All') {
      let sql = `SELECT products.*
      FROM products
      WHERE products.name LIKE ? AND products.vendor_id = ?`;
      name = "%" + req.params.name + "%";
      await db.query(sql, [name, req.user_id], function (err, result) {
        res.status(201).json({ result: result });
      });
    }else{
      let sql = `SELECT products.*
      FROM products
      WHERE products.name LIKE ? AND products.vendor_id = ? AND products.category = ?`;
      name = "%" + req.params.name + "%";
      await db.query(sql, [name, req.user_id,category], function (err, result) {
        res.status(201).json({ result: result });
      });
      
    }
  }
  else {
    if (category == 'All') {
      let sql = `SELECT products.*
      FROM products
      WHERE products.vendor_id = ?
      `;
      await db.query(sql, [req.user_id], function (err, result) {
        if (err) throw err;
        res.status(201).json({ result: result });
      });
    }else{
      let sql = `SELECT products.*
      FROM products
      WHERE products.vendor_id = ? AND products.category = ?
      `;
      await db.query(sql, [req.user_id,category], function (err, result) {
        if (err) throw err;
        res.status(201).json({ result: result });
      });
    }
  }
});


router.post("/create", verifyToken, async (req, res, next) => {
  let name = req.body.name;
  let per_day_rent = req.body.per_day_rent;
  let per_week_rent = req.body.per_week_rent;
  let category = req.body.category;
  let details = req.body.details;
  let photo;
  const thumbnail = req.files.thumbnail;
  photo = thumbnail.name.split(".");
  photo = photo[0] + "." + Date.now() + "." + photo[photo.length - 1];
  (async () => {
    thumbnail.mv(
      `${__dirname}/../../public/uploads/${photo}`,
      (err) => {
        if (err) {
          console.error(err);
        }
      }
    );
  })();
  sql =
    "INSERT INTO `products` (name,per_day_rent,per_week_rent,category, details,vendor_id,thumbnail) VALUES (?)";
  let values = [name, per_day_rent, per_week_rent, category, details, req.user_id, photo];
  await db.query(sql, [values], function (err, result) {
    if (err) {
      console.log(err)
      res.status(201).json({ 'error': 'Error while inseting data' });
    }
    else {
      res.status(201).json({ 'success': 'Product Added' });
    }
  })
});


router.put("/update/", verifyToken, async (req, res, next) => {
 let id = req.body.id,
  name = req.body.name,
  per_day_rent = req.body.per_day_rent,
  per_week_rent = req.body.per_week_rent,
  category = req.body.category,
  details = req.body.details,
  vendor_id = req.body.vendor_id,
  thumbnail = req.body.thumbnail;
  let photo;
  if (req.files === null) {
          photo = thumbnail;
        } else {
          file = req.files.file;
          fs.unlinkSync(
            `${__dirname}/../../public/uploads/${req.body.thumbnail}`
          );
          thumbnail = req.files.file;
          photo = thumbnail.name.split(".");
          photo = photo[0] + "." + Date.now() + "." + photo[photo.length - 1];
          (async () => {
            thumbnail.mv(
              `${__dirname}/../../public/uploads/${photo}`,
              (err) => {
                if (err) {
                  console.error(err);
                }
              }
            );
          })();
        }
    sql =
     `
      UPDATE products
      SET name = ?, 
      per_day_rent = ?, 
      per_week_rent = ?, 
      thumbnail = ?, 
      category = ?, 
      details = ?,
      vendor_id = ?
      WHERE id = ? 
      `;
      await db.query(sql, [name,per_day_rent,per_week_rent,photo,category, details, vendor_id, id], function (err, result) {
        if (err) throw err;
        res.status(201).json({ thumbnail:photo,'success': 'Product updated' });
      })
})


/* GET single product */
router.get("/show/:id", verifyToken, async function (req, res, next) {
  try {
    let sql = `SELECT products.*
      FROM products 
      INNER JOIN vendors ON products.vendor_id=vendors.id
      WHERE
      products.id = ?
      `;
    await db.query(sql, [req.params.id], function (err, result) {
      try {
        sql = `SELECT reviews.*,
      borrowers.firstname as borrower_firstname,
      borrowers.lastname as borrower_lastname,
      borrowers.avatar as borrower_photo
      FROM reviews 
      INNER JOIN borrowers ON reviews.borrower_id=borrowers.id
      WHERE
      reviews.product_id = ?
      `;
        db.query(sql, [req.params.id], function (err, reviews) {
          res.status(201).json({ result: result, reviews: reviews });
        });
      } catch (er) {
        console.log(err);
      }
    });
  } catch (er) {
    console.log(err);
  }
});


/* GET single product */
router.get("/edit/:id", verifyToken, async function (req, res, next) {
  let sql = `SELECT products.* FROM products
    WHERE
    products.id = ?
    `;
  await db.query(sql, [req.params.id], function (err, result) {
    res.status(201).json({ result: result });
  });
});


router.delete("/:id", verifyToken, async function (req, res, next) {
  let sql = `DELETE FROM products WHERE id = ?`;
  await db.query(sql, [req.params.id], function (err, result) {
    if (err) throw err;
    res.status(201).json({ result: result });
  });
});


router.delete("/enrollment/product/:product_id/borrower/:borrower_id", verifyToken, async function (req, res, next) {
  let sql = `DELETE FROM enrollment WHERE product_id = ? AND borrower_id = ?`;
  await db.query(sql, [req.params.product_id, req.params.borrower_id], function (err, result) {
    if (err) throw err;
    res.status(201).json({ result: result });
  });
});



// router.delete("/enrollment/:id", verifyToken, async function (req, res, next) {
//   let sql = `DELETE FROM enrollment WHERE product_id = ? AND vendor_id = ?`;
//   await db.query(sql, [req.params.id, req.user_id], function (err, result) {
//     if (err) throw err;
//     res.status(201).json({ result: result });
//   });
// });





module.exports = router;