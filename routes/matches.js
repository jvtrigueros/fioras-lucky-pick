'use strict'

var express = require('express')
  , mongodb = require('mongodb')
  , nconf = require('nconf')
  , router = express.Router()

var MongoClient = mongodb.MongoClient
  , mongoUrl = 'mongodb://' + nconf.get('db:user') + ':' + nconf.get('db:pass') + '@' + nconf.get('db:url')

router.get('/', function (req, res, next) {
  MongoClient.connect(mongoUrl, function (err, db) {
    db.collection('summoners').find().limit(10).toArray(function (err, summoners) {
      if(!err)
        res.render('matches', {summoners: summoners})
      else
        res.render('matches')
    })
  })
})

module.exports = router
