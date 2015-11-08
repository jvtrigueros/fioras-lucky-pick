'use strict'

var request = require('request')

var API_KEY = ''
var REGION = ''
var API_VERSION = 'v1.4'

function baseApiUrl(region) {
  return 'https://' + region + '.api.pvp.net/api/lol/' + region + '/' + API_VERSION + '/'
}

var summoner = {}

summoner.byName = function (region, key, summonerName, cb) {
  var url = baseApiUrl(region) + 'summoner/by-name/' + summonerName + '?api_key=' + key
  request(url, function (err, res, body) {
    if(!err) {
      if(res.statusCode == 404) {
        var summonerDto = {}
        summonerDto[summonerName] = {}
        cb(summonerDto)
      } else
        cb(JSON.parse(body)[summonerName])
    } else
      console.log(err, url)
  })
}

module.exports = function (region, key) {
  return {
    summoner: {
      byName: function (summonerName, cb) { summoner.byName(region, key, summonerName, cb) }
    }
  }
}

