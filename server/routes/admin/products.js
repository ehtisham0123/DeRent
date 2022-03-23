let express = require("express");
let router = express.Router();
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const verifyToken = require('../verifyToken');
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
/* GET products listing. */


router.get("/hired-products/:id",verifyToken,async (req, res, next) => {
   
  try{
    sql = `SELECT borrowers.id,borrowers.firstname, borrowers.lastname,borrowers.email,borrowers.avatar
      FROM borrowers
      WHERE borrowers.id IN
      (SELECT enrollment.borrower_id
      FROM enrollment
      WHERE
      product_id = ?) 
  `;
      db.query(sql, [req.params.id], function (err, result) {           
          res.status(201).json({ result:result});
      });
    }catch (er) {
      console.log(err);
    }
}); 


router.get("/:name?",verifyToken, async (req, res, next) => {
  let category = req.query.category;
  if (req.params.name) {
    if (category == 'All') {
      let sql = `SELECT products.*,vendors.name as vendor_name
      FROM products
      INNER JOIN vendors ON products.vendor_id=vendors.id 
      WHERE products.name LIKE ?`;
      name = "%" + req.params.name + "%";
      await db.query(sql, [name], function (err, result) {
        res.status(201).json({ result: result });
      });
    }else{
      let sql = `SELECT products.*,vendors.name as vendor_name
      FROM products
      INNER JOIN vendors ON products.vendor_id=vendors.id 
      WHERE products.name LIKE ? AND products.category = ? `;
      name = "%" + req.params.name + "%";
      await db.query(sql, [name,category], function (err, result) {
        res.status(201).json({ result: result });
      });
    }
  } 
  else {
    if (category == 'All') {

    let sql = `SELECT products.*,vendors.name as vendor_name
    FROM products
    INNER JOIN vendors ON products.vendor_id=vendors.id
    WHERE 1
    `;
    await db.query(sql, function (err, result) {
      if (err) throw err;
      res.status(201).json({ result: result });
    });
  }else{

    let sql = `SELECT products.*,vendors.name as vendor_name
    FROM products
    INNER JOIN vendors ON products.vendor_id=vendors.id
    WHERE 1 AND products.category = ?
    `;
    await db.query(sql,[category], function (err, result) {
      if (err) throw err;
      res.status(201).json({ result: result });
    }); 
  }

  }
});


/* GET single product */
router.get("/show/:id",verifyToken, async function (req, res, next) {
    try{
      let sql = `SELECT products.*,
      vendors.id as vendor_id,
      vendors.firstname as vendor_firstname,
      vendors.lastname as vendor_lastname,
      vendors.country as vendor_country,
      vendors.city as vendor_city,
      vendors.avatar as vendor_photo
      FROM products 
      INNER JOIN vendors ON products.vendor_id=vendors.id
      WHERE
      products.id = ?
      `;
      await db.query(sql, [req.params.id], function (err, result) {
      try{
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

                try{
                sql = `SELECT borrowers.id,borrowers.name,borrowers.avatar
                  FROM borrowers
                  WHERE borrowers.id IN
                  (SELECT enrollment.borrower_id
                  FROM enrollment
                  WHERE
                  product_id = ?)
              `;
                  db.query(sql, [req.params.id], function (err, enrollments) {           
                      res.status(201).json({ result: result , reviews : reviews ,enrollments:enrollments});
                  });
                }catch (er) {
                  console.log(err);
                }
          });
        }catch (er) {
          console.log(err);
        }
      }); 
    }catch (er) {
      console.log(err);
    }
});


/* GET single product */
router.get("/edit/:id",verifyToken, async function (req, res, next) {
    let sql = `SELECT products.* FROM products
    WHERE
    products.id = ?
    `;
    await db.query(sql, [req.params.id], function (err, result) {
      res.status(201).json({ result: result });
    });
});


router.delete("/:id",verifyToken, async function (req, res, next) {
    let sql = `DELETE FROM products WHERE id = ?`;
    await db.query(sql, [req.params.id], function (err, result) {
      if (err) throw err;
      res.status(201).json({ result: result });
    });
});

router.delete("/enrollment/product/:product_id/borrower/:borrower_id",verifyToken, async function (req, res, next) {
  let sql = `DELETE FROM enrollment WHERE product_id = ? AND borrower_id = ?`;
  await db.query(sql, [req.params.product_id, req.params.borrower_id], function (err, result) {
    if (err) throw err;
    res.status(201).json({ result: result });
  });
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
  file = req.files.file;
  let photo;
  if (req.files === null) {
          photo = thumbnail;
        } else {
          fs.unlinkSync(
            `${__dirname}/../../public/uploads/${req.body.thumbnail}`
          );
          thumbnail = req.files.file;
          photo = thumbnail.name.split(".");
          photo = photo[0] + "." + Date.now() + "." + photo[photo.length - 1];
          (async () => {
            thumbnail.mv(
              `${__dirname}/../../../frontend/public/uploads/${photo}`,
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

 
module.exports = router;