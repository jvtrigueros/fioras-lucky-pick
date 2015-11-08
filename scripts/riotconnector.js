'use strict'

var request = require('request')

var summoner = {apiUrl: 'v1.4/summoner/'}
  , league = {apiUrl: 'v2.5/league/'}

function baseApiUrl(region) {
  return 'https://' + region + '.api.pvp.net/api/lol/' + region + '/'
}

summoner.byName = function (region, key, summonerName, cb) {
  var url = baseApiUrl(region) + this.apiUrl + 'by-name/' + summonerName + '?api_key=' + key

  request(url, function (err, res, body) {
    if (!err) {
      if (res.statusCode == 404) {
        cb(new Error('Summoner with name ' + summonerName + ' does not exist.'), null)
      } else cb(null, JSON.parse(body)[summonerName])
    } else cb(err, null)
  })
}

league.bySummonerEntry = function (region, key, summonerId, cb) {
  var url = baseApiUrl(region) + this.apiUrl + 'by-summoner/' + summonerId + '/entry?api_key=' + key

  request(url, function (err, res, body) {
    if (!err && res.statusCode == 200) {
      var result = JSON.parse(body)
      cb(null, result[summonerId.toString()])
    } else cb(err, null)
  })
}

module.exports = function (region, key) {
  return {
    summoner: {
      byName: function (summonerName, cb) {
        summoner.byName(region, key, summonerName, cb)
      }
    },
    league: {
      bySummonerEntry: function (summonerId, cb) {
        league.bySummonerEntry(region, key, summonerId, cb)
      }
    }
  }
}
