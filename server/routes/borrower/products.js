let express = require("express");
let router = express.Router();
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const verifyToken = require("../verifyToken");
let temp = {};

let db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "de_rent",
});

router.get("/enrolled/:name?", verifyToken, async function (req, res, next) {
  try {
    if (req.params.name) {
    let sql = `
    SELECT products.*
    FROM products
    WHERE products.name LIKE ? AND products.id IN (SELECT enrollment.product_id 
    FROM enrollment WHERE borrower_id = ?)`;
      name = "%" + req.params.name + "%";
      await db.query(sql, [name, req.user_id], function (err, products) {
        res.status(201).json({ products: products });
      });
    } else {
      sql = `
    SELECT products.*
    FROM products
    WHERE products.id IN
    (SELECT enrollment.product_id
    FROM enrollment
    WHERE
    borrower_id = ?);
    `;
      await db.query(sql, [req.user_id], function (err, products) {
        res.status(201).json({ products: products });
      });
    }
  } catch (er) {
    console.log(err);
  }
});

// connect to database
db.connect();
/* GET products listing. */
router.get("/:name?", verifyToken, (req, res, next) => {
  let category = req.query.category;
  const getUser = async () => {
    var sql = `SELECT borrowers.latitude as borrower_latitude,borrowers.longitude as borrower_longitude FROM borrowers WHERE borrowers.id = ?`;
     db.query(sql, [req.user_id], function (err, borrower) {
      borrower = borrower[0];
      if (req.params.name) {
        if (category == 'All') {
        let sql = `SELECT products.*,vendors.name as vendor_name
          FROM products
          INNER JOIN vendors ON products.vendor_id=vendors.id 
          WHERE products.name LIKE ?`;
        name = "%" + req.params.name + "%";
        db.query(sql,[name], (err, products) => {
          if (err) throw err;
  
              for(let i=1; i<products.length; i++)
              {
                for(let j=0; j<products.length-i; j++) 
                {    
                  var radlat1 = Math.PI * parseFloat(borrower.borrower_latitude)/180;
                  var radlat2 = Math.PI * parseFloat(products[j].latitude)/180;
                  var theta = parseFloat(borrower.borrower_longitude)-parseFloat(products[j].longitude);
                  var radtheta = Math.PI * theta/180;
                  var dist1 = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
                  if (dist1 > 1) {
                    dist1 = 1;
                  }
                  dist1 = Math.acos(dist1);
                  dist1 = dist1 * 180/Math.PI;
                  dist1 = dist1 * 60 * 1.1515;
                  dist1 = dist1 * 1.609344      
                  radlat1 = Math.PI * parseFloat(borrower.borrower_latitude)/180;
                  radlat2 = Math.PI * parseFloat(products[j+1].latitude)/180;
                  theta = parseFloat(borrower.borrower_longitude)-parseFloat(products[j+1].longitude);
                  radtheta = Math.PI * theta/180;
                  var dist2 = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
                  if (dist2 > 1) {
                    dist2 = 1;
                  }
                  dist2 = Math.acos(dist2);
                  dist2 = dist2 * 180/Math.PI;
                  dist2 = dist2 * 60 * 1.1515;
                  dist2 = dist2 * 1.609344     
                  if((dist2)<(dist1))
                  {
                    temp=products[j];
                    products[j]=products[j+1];
                    products[j+1]=temp;
                  }   
                }
              }
          res.status(201).json({ result: products });
        });
      }else{
         let sql = `SELECT products.*,vendors.name as vendor_name
          FROM products
          INNER JOIN vendors ON products.vendor_id=vendors.id 
          WHERE products.name LIKE ? AND products.category = ? `;
        name = "%" + req.params.name + "%";
        db.query(sql,[name,category], (err, products) => {
          if (err) throw err;
  
              for(let i=1; i<products.length; i++)
              {
                for(let j=0; j<products.length-i; j++) 
                {    
                  var radlat1 = Math.PI * parseFloat(borrower.borrower_latitude)/180;
                  var radlat2 = Math.PI * parseFloat(products[j].latitude)/180;
                  var theta = parseFloat(borrower.borrower_longitude)-parseFloat(products[j].longitude);
                  var radtheta = Math.PI * theta/180;
                  var dist1 = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
                  if (dist1 > 1) {
                    dist1 = 1;
                  }
                  dist1 = Math.acos(dist1);
                  dist1 = dist1 * 180/Math.PI;
                  dist1 = dist1 * 60 * 1.1515;
                  dist1 = dist1 * 1.609344      
                  radlat1 = Math.PI * parseFloat(borrower.borrower_latitude)/180;
                  radlat2 = Math.PI * parseFloat(products[j+1].latitude)/180;
                  theta = parseFloat(borrower.borrower_longitude)-parseFloat(products[j+1].longitude);
                  radtheta = Math.PI * theta/180;
                  var dist2 = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
                  if (dist2 > 1) {
                    dist2 = 1;
                  }
                  dist2 = Math.acos(dist2);
                  dist2 = dist2 * 180/Math.PI;
                  dist2 = dist2 * 60 * 1.1515;
                  dist2 = dist2 * 1.609344     
                  if((dist2)<(dist1))
                  {
                    temp=products[j];
                    products[j]=products[j+1];
                    products[j+1]=temp;
                  }   
                }
              }
          res.status(201).json({ result: products });
        });

      }
      } else {
        if (category != 'All') {
        let sql = `SELECT products.*,vendors.name  as vendor_name,vendors.latitude,vendors.longitude
          FROM products
          INNER JOIN vendors ON products.vendor_id=vendors.id
          WHERE products.category = ? 
          `;
          db.query(sql,[category], (err, products) => {
          if (err) throw err;
  
              for(let i=1; i<products.length; i++)
              {
                for(let j=0; j<products.length-i; j++) 
                {    
                  var radlat1 = Math.PI * parseFloat(borrower.borrower_latitude)/180;
                  var radlat2 = Math.PI * parseFloat(products[j].latitude)/180;
                  var theta = parseFloat(borrower.borrower_longitude)-parseFloat(products[j].longitude);
                  var radtheta = Math.PI * theta/180;
                  var dist1 = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
                  if (dist1 > 1) {
                    dist1 = 1;
                  }
                  dist1 = Math.acos(dist1);
                  dist1 = dist1 * 180/Math.PI;
                  dist1 = dist1 * 60 * 1.1515;
                  dist1 = dist1 * 1.609344      
                  radlat1 = Math.PI * parseFloat(borrower.borrower_latitude)/180;
                  radlat2 = Math.PI * parseFloat(products[j+1].latitude)/180;
                  theta = parseFloat(borrower.borrower_longitude)-parseFloat(products[j+1].longitude);
                  radtheta = Math.PI * theta/180;
                  var dist2 = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
                  if (dist2 > 1) {
                    dist2 = 1;
                  }
                  dist2 = Math.acos(dist2);
                  dist2 = dist2 * 180/Math.PI;
                  dist2 = dist2 * 60 * 1.1515;
                  dist2 = dist2 * 1.609344     
                  if((dist2)<(dist1))
                  {
                    temp=products[j];
                    products[j]=products[j+1];
                    products[j+1]=temp;
                  }   
                }
              }
          res.status(201).json({ result: products });
        });
     
        }else{

        let sql = `SELECT products.*,vendors.name  as vendor_name,vendors.latitude,vendors.longitude
          FROM products
          INNER JOIN vendors ON products.vendor_id=vendors.id
          WHERE 1 
          `;
          db.query(sql, (err, products) => {
          if (err) throw err;
  
              for(let i=1; i<products.length; i++)
              {
                for(let j=0; j<products.length-i; j++) 
                {    
                  var radlat1 = Math.PI * parseFloat(borrower.borrower_latitude)/180;
                  var radlat2 = Math.PI * parseFloat(products[j].latitude)/180;
                  var theta = parseFloat(borrower.borrower_longitude)-parseFloat(products[j].longitude);
                  var radtheta = Math.PI * theta/180;
                  var dist1 = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
                  if (dist1 > 1) {
                    dist1 = 1;
                  }
                  dist1 = Math.acos(dist1);
                  dist1 = dist1 * 180/Math.PI;
                  dist1 = dist1 * 60 * 1.1515;
                  dist1 = dist1 * 1.609344      
                  radlat1 = Math.PI * parseFloat(borrower.borrower_latitude)/180;
                  radlat2 = Math.PI * parseFloat(products[j+1].latitude)/180;
                  theta = parseFloat(borrower.borrower_longitude)-parseFloat(products[j+1].longitude);
                  radtheta = Math.PI * theta/180;
                  var dist2 = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
                  if (dist2 > 1) {
                    dist2 = 1;
                  }
                  dist2 = Math.acos(dist2);
                  dist2 = dist2 * 180/Math.PI;
                  dist2 = dist2 * 60 * 1.1515;
                  dist2 = dist2 * 1.609344     
                  if((dist2)<(dist1))
                  {
                    temp=products[j];
                    products[j]=products[j+1];
                    products[j+1]=temp;
                  }   
                }
              }
          res.status(201).json({ result: products });
        });
     





        }







      }





    });
  };
  getUser();
});

/* GET single product */
router.get("/show/:id", verifyToken, async (req, res, next) => {
  try {
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
    await db.query(sql, [req.params.id], (err, result) => {
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
        db.query(sql, [req.params.id], (err, reviews) => {
          try {
            sql = `SELECT enrollment.*
              FROM enrollment
              WHERE
              borrower_id = ? AND product_id = ?;
              `;
            db.query(
              sql,
              [req.user_id, req.params.id],
              function (err, enrollment) {
                if (enrollment.length > 0) {
                  res.status(201).json({
                    result: result,
                    reviews: reviews,
                    enrollment_id: enrollment[0].id,
                  });
                } else {
                  res.status(201).json({
                    result: result,
                    reviews: reviews,
                    enrollment_id: 0,
                  });
                }
              }
            );
          } catch (er) {
            console.log(err);
          }
        });
      } catch (er) {
        console.log(err);
      }
    });
  } catch (er) {
    console.log(err);
  }
});

router.delete("/enrollment/:id", verifyToken, async (req, res, next) => {
  let sql = `DELETE FROM enrollment WHERE product_id = ? AND borrower_id = ?`;
  await db.query(sql, [req.params.id, req.user_id], (err, result) => {
    if (err) throw err;
    res.status(201).json({ result: result });
  });
});

router.delete("/reviews/:id", verifyToken, async function (req, res, next) {
  let sql = `DELETE FROM reviews WHERE id = ? AND borrower_id`;
  await db.query(sql, [req.params.id, req.user_id], function (err, result) {
    if (err) throw err;
    res.status(201).json({ result: result });
  });
});

router.post("/enroll", verifyToken, async function (req, res, next) {
  const product_id = req.body.product_id;
  const vendor_id = req.body.vendor_id;
  const borrower_id = req.user_id;
  sql =
    "INSERT INTO `enrollment` (borrower_id, product_id,vendor_id) VALUES (?)";
  let values = [borrower_id, product_id, vendor_id];
  await db.query(sql, [values], function (err, result) {
    if (err) {
      console.log(err);
    } else {
      res.status(201).json({ enrollment_id: result.insertId });
    }
  });
});

router.post("/review", verifyToken, async function (req, res, next) {
  const borrower_id = req.user_id;
  const product_id = req.body.product_id;
  const vendor_id = req.body.vendor_id;
  const enorllment_id = req.body.enorllment_id;
  const reviews = req.body.reviews;
  const reviews_details = req.body.reviews_details;

  sql =
    "INSERT INTO `reviews` (borrower_id, product_id,vendor_id,enrollment_id,reviews,reviews_details) VALUES (?)";
  let values = [
    borrower_id,
    product_id,
    vendor_id,
    enorllment_id,
    reviews,
    reviews_details,
  ];
  await db.query(sql, [values], function (err, result) {
    if (err) {
      console.log(err);
      res.status(201).json({ error: "Error while inseting data" });
    } else {
      res.status(201).json({ success: "Review Added" });
    }
  });
});

/* GET borrowers listing. */

module.exports = router;
