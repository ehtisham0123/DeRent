const express = require('express');
const verifyToken = require('../verifyToken');
const router = express.Router();
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const mysql = require("mysql");
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


// Login
router.post('/login', (req, res) => {
    let email = req.body.email;
    let password  = req.body.password;
   var sql = 'SELECT * FROM borrowers WHERE email = ? ';
        db.query(sql, [email], function (err, borrower) {
    borrower = borrower[0];
    if (borrower) {
      var passwordIsValid = bcrypt.compareSync(req.body.password, borrower.password);
      if (!passwordIsValid) {
        res.status(201).json({'error':'invalid credentials'});
      }
      else{
        var token = jwt.sign({ id: borrower.id,email:borrower.email,role:'borrower' }, 'Ehtisham');
        res.status(201).json({'user_id':borrower.id,'user_role':'borrower','token':token});
      }
    }else{
      res.status(201).json({'error':'invalid credentials'});
    }
    
  });

});


router.post("/signup", async (req, res, next) => {
   let name = req.body.name,
    email = req.body.email,
    password = req.body.password,
    firstname = req.body.firstname,
    lastname = req.body.lastname,
    age = req.body.age,
    housenumber = req.body.housenumber,
    streetnumber = req.body.streetnumber,
    city = req.body.city,
    state = req.body.state,
    postalcode = req.body.postalcode,
    country = req.body.country,
    contact = req.body.contact,
    gender = req.body.gender,
    latitude = req.body.latitude,
    longitude = req.body.longitude,
    created_at = "date",
    updated_at = "date";
  email = email.toLowerCase();
  let photo;

  try {
    var sql = "SELECT * FROM borrowers WHERE email = ? ";
    await db.query(sql, [email], function (err, result) {
      if (result.length > 0) {
        return res.status(201).json({ error: "Email is already registered" });
      } else {
        if (req.files === null) {
          photo = "profile.png";
        } else {
          const avatar = req.files.avatar;
          photo = avatar.name.split(".");
          photo = photo[0] + "." + Date.now() + "." + photo[photo.length - 1];
          (async () => {
            avatar.mv(
              `${__dirname}/../../public/uploads/${photo}`,
              (err) => {
                if (err) {
                  console.error(err);
                }
              }
            );
          })();
        }
        //Hash Password
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(password, salt, async (err, hash) => {
            var sql =
              "INSERT INTO `borrowers` (name, email,password,firstname,lastname,gender,age,contact,avatar,housenumber,streetnumber,city,state,postalcode,country,latitude,longitude,created_at,updated_at) VALUES (?)";
            var values = [
              name,
              email,
              hash,
              firstname,
              lastname,
              gender,
              age,
              contact,
              photo,
              housenumber,
              streetnumber,
              city,
              state,
              postalcode,
              country,
              latitude,
              longitude,
              created_at,
              updated_at,
            ];
            await db.query(sql, [values], function (err, result) {
              if (err) {
                res.status(201).json({ error: "Error while inseting data" });
              } else {
                 var token = jwt.sign({ id: result.insertId,email:email,role:'borrower' }, 'Ehtisham');
                 res.status(201).json({'user_id':result.insertId,'user_role':'borrower','token':token});             
              }
            });
          })
        );
      }
    });
  } catch (err) {
    console.log(err);
  }
});


/* GET borrowers listing. */
router.get("/edit/", verifyToken, async function (req, res, next) {
  try {
    var sql = `SELECT borrowers.* FROM borrowers WHERE borrowers.id = ?`;
    await db.query(sql, [req.user_id], function (err, result) {
      res.status(201).json({ result: result });
    });
  } catch (er) {
    console.log(err);
  }
});

/* GET borrowers listing. */
router.get("/", verifyToken, async function (req, res, next) {
   try {
    var sql = `SELECT borrowers.* FROM borrowers WHERE borrowers.id = ?`;
    await db.query(sql, [req.user_id], function (err, result) {
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
             await db.query(sql, [req.user_id], function (err, products) {       
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
router.put("/update",verifyToken, async (req, res, next) => {
  let id = req.body.id,
    name = req.body.name,
    email = req.body.email,
    firstname = req.body.firstname,
    lastname = req.body.lastname,
    age = req.body.age,
    housenumber = req.body.housenumber,
    streetnumber = req.body.streetnumber,
    city = req.body.city,
    state = req.body.state,
    postalcode = req.body.postalcode,
    country = req.body.country,
    contact = req.body.contact,
    gender = req.body.gender,
    avatar = req.body.avatar,
    latitude = req.body.latitude,
    longitude = req.body.longitude,
    oldEmail = req.body.oldEmail,
    updated_at = "24";
  email = email.toLowerCase();
  let photo;
  try {
    var sql = "SELECT * FROM borrowers WHERE email = ? ";
    await db.query(sql, [email], function (err, result) {
      if (result.length > 0 && result[0].email != oldEmail) {
        return res.status(201).json({ error: "Email is already registered" });
      } else {
        if (req.files === null) {
          photo = avatar;
        } else {
          if (req.body.avatar != 'profile.png') {
            fs.unlinkSync(
              `${__dirname}/../../public/uploads/${req.body.avatar}`
            );
          }
          const avatar = req.files.file;
          photo = avatar.name.split(".");
          photo = photo[0] + "." + Date.now() + "." + photo[photo.length - 1];
          (async () => {
            avatar.mv(
              `${__dirname}/../../public/uploads/${photo}`,
              (err) => {
                if (err) {
                  console.error(err);
                }
              }
            );
          })();
        }
        sql = `UPDATE borrowers SET name = ? , email = ? , firstname = ? , lastname = ? , gender = ? , age = ? , contact = ? , avatar = ? , housenumber = ? , streetnumber = ? , city = ? , state = ? , postalcode = ? , country = ? , latitude = ? , longitude = ? , updated_at = ? WHERE id = ? ;`;
        db.query(
          sql,
          [
            name,
            email,
            firstname,
            lastname,
            gender,
            age,
            contact,
            photo,
            housenumber,
            streetnumber,
            city,
            state,
            postalcode,
            country,
            latitude,
            longitude,
            updated_at,
            id,
          ],
          function (err, result) {
            if (err) {
              res.status(201).json({ error: "Error while updating data" });
            } else {
              res.status(201).json({ avatar:photo ,name:name ,success: "Profile Updated" });
            }
          }
        );
      }
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;