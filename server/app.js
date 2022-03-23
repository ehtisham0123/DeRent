var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const mysql = require("mysql");

let db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "de_rent",
});

// connect to database
db.connect();


var adminRouter = require('./routes/admin/admin');
var borrowersAdminRouter = require('./routes/admin/borrowers');
var vendorsAdminRouter = require('./routes/admin/vendors');
var productsAdminRouter = require('./routes/admin/products');

var vendorRouter = require('./routes/vendor/vendor');
var productsVendorRouter = require('./routes/vendor/products');
var borrowerVendorRouter = require('./routes/vendor/borrower');
var chatVendorRouter = require('./routes/vendor/chat');

var borrowerRouter = require('./routes/borrower/borrower');
var productsBorrowerRouter = require('./routes/borrower/products');
var vendorBorrowerRouter = require('./routes/borrower/vendor');
var chatBorrowerRouter = require('./routes/borrower/chat');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {
   var sql = `select 
    (select count(*) from borrowers) as borrowers,
    (select count(*) from vendors) as vendors,
    (select count(*) from products) as products`;  
      await db.query(sql, function (err, result) {
      if (err) throw err;
      res.status(201).json({ result: result });
    });
});

app.use('/admin', adminRouter);
app.use('/admin/borrowers', borrowersAdminRouter);
app.use('/admin/vendors', vendorsAdminRouter);
app.use('/admin/products', productsAdminRouter);

app.use('/vendor', vendorRouter);
app.use('/vendor/products', productsVendorRouter);
app.use('/vendor/borrowers/profile/', borrowerVendorRouter);
app.use('/vendor/chat/', chatVendorRouter);


app.use('/borrower', borrowerRouter);
app.use('/borrower/products', productsBorrowerRouter);
app.use('/borrower/vendors/profile/', vendorBorrowerRouter);
app.use('/borrower/chat/', chatBorrowerRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
