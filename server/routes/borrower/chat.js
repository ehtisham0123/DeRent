var express = require("express");
var router = express.Router();
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const verifyToken = require("../verifyToken");
const MySQLEvents = require('@rodrigogs/mysql-events');
const Pusher = require("pusher");

let db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "de_rent",
});

// connect to database
db.connect();

const pusher = new Pusher({
  appId: "1213321",
  key: "ea25a3949b7662bf5669",
  secret: "4ba7f89ef3734b4eea50",
  cluster: "ap2",
  useTLS: true
});

/* GET vendors listing. */
router.get("/messages/:id", verifyToken, async function (req, res, next) {
    var sql = `SELECT * FROM messages WHERE borrower_id = ? AND vendor_id = ?;`;
    await db.query(sql,[ req.user_id,req.params.id], function (err, messages) {
      if (err) throw err;
      res.status(201).json({ messages: messages });
    });

 });



/* GET vendors listing. */
router.get("/vendor/:id", verifyToken, async function (req, res, next) {
  try {
    var sql = `SELECT vendors.id,vendors.name,vendors.firstname,vendors.lastname,vendors.avatar FROM vendors WHERE vendors.id = ?`;
    await db.query(sql,[req.params.id], function (err, result) {
            res.status(201).json({ result: result});      
      });
  }
   catch (er) {
  console.log(err);
  }

});



/* GET vendors listing. */
router.get("/avatar/", verifyToken, async function (req, res, next) {
  try {
    var sql = `SELECT borrowers.avatar,borrowers.name FROM borrowers WHERE borrowers.id = ?`;
    await db.query(sql,[req.user_id], function (err, result) {
            res.status(201).json({ result: result});      

      });
  }
   catch (er) {
  console.log(err);
  }

});






/* GET vendors listing. */
router.get("/:name?", verifyToken, async function (req, res, next) {
  if (req.params.name) {
    var sql = `SELECT vendors.id,vendors.name,vendors.firstname,vendors.lastname,vendors.avatar FROM vendors WHERE (CONCAT(vendors.firstname, ' ', vendors.lastname) LIKE ?) AND vendors.id IN (SELECT chat.vendor_id FROM chat WHERE borrower_id = ?);`;
    name = "%" + req.params.name + "%";
    await db.query(sql, [name,req.user_id], function (err, result) {
      res.status(201).json({ result: result });
    });
  } else {
    var sql = `SELECT vendors.id,vendors.name,vendors.firstname,vendors.lastname,vendors.avatar FROM vendors WHERE vendors.id IN (SELECT chat.vendor_id FROM chat WHERE borrower_id = ?);`;
    await db.query(sql,[req.user_id], function (err, result) {
      if (err) throw err;
      res.status(201).json({ result: result });
    });
  }
});

router.post('/messages/new',verifyToken, async function(req, res, next) {

  let { message,vendor_id } = req.body;

   var sql = `SELECT * FROM chat WHERE borrower_id = ? AND vendor_id = ?;`;
    await db.query(sql,[ req.user_id,vendor_id], function (err, result) {
     if(!result.length > 0){
        sql = "INSERT INTO `chat` (`borrower_id`,`vendor_id`) VALUES (?)";
        var values = [req.user_id,vendor_id];
       return db.query(sql,[values], function (err, result) {
          if (err) throw err; 
            sql = "INSERT INTO `messages` (`borrower_id`, `vendor_id`, `message`,status) VALUES (?)";
            var values = [req.user_id,vendor_id,message,true];
            return db.query(sql,[values], function (err, result) {
                if (err) throw err; 
                 var sql = 'SELECT * FROM messages WHERE id = ?';
                   return  db.query(sql,result.insertId, function (err, result) {
                      pusher.trigger("messages", "inserted", 
                      {    
                         borrower_id:result[0].borrower_id,
                         vendor_id:result[0].vendor_id,
                         message:result[0].message,
                         created_at:result[0].created_at,
                         status:result[0].status,     
                      });
                  });                    
            }); 


            }
            ); 
      }
      else{
            sql = "INSERT INTO `messages` (`borrower_id`, `vendor_id`, `message`,status) VALUES (?)";
            var values = [req.user_id,vendor_id,message,true];
             db.query(sql,[values], function (err, result) {
                if (err) throw err; 
              
                var sql = 'SELECT * FROM messages WHERE id = ?';
                     db.query(sql,result.insertId, function (err, result) {
                      pusher.trigger("messages", "inserted", 
                      {    
                         borrower_id:result[0].borrower_id,
                         vendor_id:result[0].vendor_id,
                         message:result[0].message,
                         created_at:result[0].created_at,
                         status:result[0].status,     
                      });
                  });



                res.status(201).json('message saved'); 

            }); 
      }

    });


});



module.exports = router;
