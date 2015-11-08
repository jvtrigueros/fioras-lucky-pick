'use strict'

var request = require('request')

var API_KEY = ''
var REGION = ''

function baseApiUrl(region) {
  return 'https://' + region + '.api.pvp.net/api/lol/' + region + '/'
}

var summoner = { apiUrl: 'v1.4/summoner/' }
var stats = { apiUrl: 'v1.3/stats' }

summoner.byName = function (region, key, summonerName, cb) {
  var url = baseApiUrl(region) + this.apiUrl + 'by-name/' + summonerName + '?api_key=' + key

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

