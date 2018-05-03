var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('../routes/index');
var usersRouter = require('../routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

var normalizedPath = require("path").join(__dirname, "../models");

require("fs").readdirSync(normalizedPath).forEach(function(file) {
  require("../models/" + file);
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

// Ошибки со стороны пользователя
app.use(function(req, res, next) {
  next(createError(404));
});

// Ошибки со стороны сервера
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app
