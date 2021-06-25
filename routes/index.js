const express = require('express');
const router = express.Router();
const moment = require('moment');
const { ObjectId } = require("mongodb")

module.exports = (db) => {
  router.get('/', async function (req, res, next) {
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


    let count = await db.collection('bread').find(params).count()

    const page = req.query.page || 1;
    const limit = 2;
    const skip = (page - 1) * limit;
    const url = req.url == '/' ? '/?page=1' : req.url
    const total = count;
    const pages = Math.ceil(total / limit);
    //console.log(params);
    let data = await db.collection('bread').find(params).skip(skip).limit(limit).toArray()

    res.render('index', {
      data,
      page,
      pages,
      query: req.query,
      url,
      moment
    });
  });

  router.get('/add', function (req, res, next) {
    res.render('add', {
      title: 'Express',
      data: ""
    });
  });
  router.post('/add', async function (req, res, next) {
    try {
      const result = await db.collection('bread').insertOne(req.body)
      console.log(
        `${result.insertedCount} documents were inserted with the _id: ${result.insertedId}`,
      );
      res.redirect("/")

    } catch (error) {
      console.log(error)
      res.status(500).json({ error: true, message: error })

    }
  });

  router.get('/delete', async function (req, res, next) {
    let id = req.query.id;
    try {
      await db.collection('bread').deleteOne({ "_id": ObjectId(id) })
      res.redirect("/")
    } catch (err) {
      console.log(err)
      res.status(500).json({ error: true, message: err })

    }

  });

  router.get('/edit', async function (req, res, next) {
    try {
      const editId = req.query.id
      const item = await db.collection('bread').find({ "_id": ObjectId(editId) }).toArray()
      res.render("edit", {
        item: item[0]
      })
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: true, message: error })
    }
  });

  router.post('/edit', async function (req, res, next) {
    try {
      const { _id, string, integer, float, date, boolean } = req.body
      let newData = { string, integer, float, date, boolean }
      await db.collection('bread').updateOne({ "_id": ObjectId(_id.trim()) }, { $set: newData })
      res.redirect("/")

    } catch (err) {
      console.log(err)
      res.status(500).json({ error: true, message: err })
    }
  });

  return router
}