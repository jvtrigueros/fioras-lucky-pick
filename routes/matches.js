'use strict'

var express = require('express')
  , mongodb = require('mongodb')
  , nconf = require('nconf')
  , router = express.Router()

var MongoClient = mongodb.MongoClient
  , mongoUrl = 'mongodb://' + nconf.get('db:user') + ':' + nconf.get('db:pass') + '@' + nconf.get('db:url')
  , iconUrl = 'http://ddragon.leagueoflegends.com/cdn/5.22.1/img/profileicon/'

router.get('/', function (req, res, next) {
  MongoClient.connect(mongoUrl, function (err, db) {
    db.collection('summoners').find().limit(9).toArray(function (err, summoners) {
      if(!err)
        res.render('matches', {summoners: summoners, iconUrl: iconUrl})
      else
        res.render('matches')
    })
  })
})

module.exports = router
