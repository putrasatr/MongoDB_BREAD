var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const { MongoClient } = require('mongodb')
const assert = require("assert")
require("dotenv").config()



// view engine setup
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// var users = require('./routes/users');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const baseUrl = process.env.DB_URL
const dbName = process.env.DB_NAME
const url = baseUrl + dbName

MongoClient.connect(baseUrl,{ useUnifiedTopology: true, useNewUrlParser: true }, function (err, client) {
  // assert.equal(null, err);
  if (err) throw err
  console.log("Connected successfully to server");
  const db = client.db(dbName);
  const indexRouter = require('./routes/index')(db);
  app.use('/', indexRouter);
})

module.exports = app