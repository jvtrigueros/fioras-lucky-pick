var express = require('express')
  , mongodb = require('mongodb')
  , nconf = require('nconf')
  , router = express.Router()

nconf.file('config.js')

var regions = [ "BR"
              , "EUNE"
              , "EUW"
              , "KR"
              , "LAN"
              , "LAS"
              , "NA"
              , "OCE"
              , "RU"
              , "TR"
              ]

var roles = [ "TOP"
            , "MID"
            , "JUNGLE"
            , "ADC"
            , "SUPPORT"
            ]

var MongoClient = mongodb.MongoClient

router.get('/', function(req, res, next) {
  res.render('registration', { regions: regions, roles: roles, user_id: req.user.id })
})

router.post('/', function (req, res) {
  MongoClient.connect('mongodb://' + nconf.get('db:user') + ':' + nconf.get('db:pass') + '@' + nconf.get('db:url'), function (err, db) {
    db.collection('summoners').insertOne(req.body, function (err, result) {
      res.redirect('/profile')
    })
  })
})

module.exports = router
