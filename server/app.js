let createError = require("http-errors");
let express = require("express");
let path = require("path");
let cookieParser = require("cookie-parser");
let logger = require("morgan");
const mongoose = require("mongoose");
let indexRouter = require("./routes/auth");
let chatRouter = require("./routes/chat");
require("dotenv").config();
let app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(require("cors")());
app.use("/auth", indexRouter);
app.use("/chat", chatRouter);
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
  res.send("error");
});

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true }, (error) => {
  if (error) console.log(error);
  else console.log("Database Connected Successfully");
});
module.exports = app;
