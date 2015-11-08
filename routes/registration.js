var express = require('express')
  , mongodb = require('mongodb')
  , nconf = require('nconf')
  , router = express.Router()

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
  var user = req.user || {id: null}

  res.render('registration', { regions: regions, roles: roles, _id: user.id })
})

router.post('/', function (req, res) {
  MongoClient.connect('mongodb://' + nconf.get('db:user') + ':' + nconf.get('db:pass') + '@' + nconf.get('db:url'), function (err, db) {
    // TODO: talk to rito to get their rank
    db.collection('summoners').insertOne(req.body, function (err, result) {
      res.redirect('/profile')
    })
  })
})

module.exports = router
