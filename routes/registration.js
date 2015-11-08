var express = require('express')
  , mongodb = require('mongodb')
  , nconf = require('nconf')
  , riotConnector = require('../scripts/riotconnector')
  , helpers = require('../scripts/hbs-helpers')
  , router = express.Router()

var regions = [ 'br'
              , 'eune'
              , 'euw'
              , 'kr'
              , 'lan'
              , 'las'
              , 'na'
              , 'oce'
              , 'ru'
              , 'tr'
              ]

var roles = [ 'Top'
            , 'Mid'
            , 'Jungle'
            , 'Adc'
            , 'Support'
            ]

var pings = [ {name: 'GODLY' , range: '0-20'}
            , {name: 'LOW' , range: '21-60'}
            , {name: 'MEDIUM' , range: '61-100'}
            , {name: 'HIGH' , range: '101-149'}
            , {name: 'UNPLAYABLE' , range: '150+'}
            ]

var MongoClient = mongodb.MongoClient
  , mongoUrl = 'mongodb://' + nconf.get('db:user') + ':' + nconf.get('db:pass') + '@' + nconf.get('db:url')
  , riot = riotConnector(nconf.get('riot:key'))

router.get('/', function (req, res, next) {
  var user = req.user || {id: null}

  res.render('registration', {
    regions: regions, roles: roles, pings: pings, _id: user.id, helpers: helpers})
})

router.post('/', function (req, res) {
  var result = req.body

  riot.summoner.byName(result.region, result.summoner, function (err, summonerDto) {
    if (!err) {
      result.summonerId = summonerDto.id
      riot.league.bySummonerEntry(result.region, result.summonerId, function (err, leagues) {
        if (!err)
          leagues
            .filter(function (league) {
              return league.queue == 'RANKED_SOLO_5x5'
            })
            .forEach(function (league) {
              result.tier = league.tier.toLowerCase()
              result.division = league.entries[0].division

              MongoClient.connect(mongoUrl, function (err, db) {
                db.collection('summoners').insertOne(result, function (err) {
                  if(!err)
                    res.redirect('/profile')
                  else
                    res.redirect('back')
                })
              })
            })
        else
          res.redirect('back')
      })
    } else res.redirect('back')
  })
})

module.exports = router
