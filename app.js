var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
//JWT
const passport = require("passport");
const BasicStrategy = require("passport-http").BasicStrategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwtSettings = require("./constants/jwtSettings");
// IMPORTS

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var categoriesRouter = require("./routes/categories");
var suppliersRouter = require("./routes/suppliers");
var productsRouter = require("./routes/products");
var customersRouter = require("./routes/customers");
var employeesRouter = require("./routes/employees");
var ordersRouter = require("./routes/orders");
var authRouter = require("./routes/auth");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
//cors cho phép bên ngoài truy cập api
app.use(
  cors({
    origin: "*",
  })
);
//passport: basic auth
passport.use(
  new BasicStrategy(async (username, password, done) => {
    console.log("🚀 BasicStrategy");

    // hard code
    if (username === "chinhhuynh" && password === "deptrai123") {
      let error = null;
      let user = true;
      return done(error, user);
    } else {
      let error = null;
      let user = false;
      return done(error, user);
    }
  })
);
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = jwtSettings.SECRET;
opts.audience = jwtSettings.AUDIENCE;
opts.issuer = jwtSettings.ISSUER;
passport.use(
  new JwtStrategy(opts, function (payload, done) {
    console.log(payload);
    if (["tungnt@softech.vn", "peter@gmail.com"].includes(payload.sub)) {
      let error = null;
      let user = true;
      return done(error, user);
    } else {
      let error = null;
      let user = false;
      return done(error, user);
    }
  })
);

//mongoose
mongoose
  .connect("mongodb://localhost:27017/online-shop")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error: ", err);
  });

//register routes
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/categories", categoriesRouter);
app.use("/customers", customersRouter);
app.use("/products", productsRouter);
app.use("/suppliers", suppliersRouter);
app.use("/employees", employeesRouter);
app.use("/orders", ordersRouter);
app.use("/auth", authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
