const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const model = require('../models/model');
const Demo = model.Demo;
const moment = require('moment');

mongoose.connect('mongodb://localhost/express');


router.get('/', function (req, res, next) {
  let params = {};

  if (req.query.checkid && req.query.formid) {
    params["id"] = req.query.formid
  }

  if (req.query.checkstring && req.query.formstring) {
    params["string"] = req.query.formstring
  }

  if (req.query.checkinteger && req.query.forminteger) {
    params["integer"] = req.query.forminteger
  }

  if (req.query.checkfloat && req.query.formfloat) {
    params["float"] = req.query.formfloat
  }

  if (req.query.checkdate && req.query.formdate && req.query.formenddate) {
    params["date"] = {
      "$gte": new Date(req.query.formdate),
      "$lt": new Date(req.query.formenddate)
    }
  }

  if (req.query.checkboolean && req.query.boolean) {
    params["boolean"] = req.query.boolean
  }

  Demo.find(params, (err, count) => {

    //console.log(count);

    const page = req.query.page || 1;
    const limit = 3;
    const offset = (page - 1) * limit;
    const url = req.url == '/' ? '/?page=1' : req.url
    const total = count.length;
    const pages = Math.ceil(total / limit);
    //console.log(params);

    Demo.find(params, null, {
      limit: limit,
      skip: offset
    }).then(function (data) {
      // console.log(data);
      res.render('index', {
        data,
        page,
        pages,
        query: req.query,
        url,
        moment
      });
    });
  });
});

router.get('/add', function (req, res, next) {
  Demo.find(function (err, rows) {
    res.render('add', {
      title: 'Express',
      data: rows
    });
  });
});
router.post('/add', function (req, res, next) {
  let item = new Demo({
    id: req.body.id,
    string: req.body.string,
    integer: req.body.integer,
    float: req.body.float,
    date: new Date(req.body.date),
    boolean: req.body.boolean
  });
  console.log('create success');
  item.save(function (err, rows) {
    res.redirect('/');
  });
});

router.get('/delete', function (req, res, next) {
  let id = req.query.id;
  Demo.findByIdAndRemove(_id = id, function (err, data) {
    console.log("delete success");
    res.redirect('/');
  });
});

router.get('/edit', function (req, res, next) {
  let id = req.query.id;
  Demo.find({
    _id: id
  }, function (err, rows) {
    //console.log("show edit");
    console.log(id);
    res.render('edit', {
      item: rows[0]
    });
  });
});

router.post('/edit', function (req, res, next) {
  let id = req.query.id;
  Demo.update({
      "_id": id
    }, {
      $set: {
        "string": req.body.string,
        "integer": req.body.integer,
        "float": req.body.float,
        "date": req.body.date,
        "boolean": req.body.boolean
      }
    },
    function (err) {
      console.log("edit success");
      res.redirect('/');
    });
});

module.exports = router;