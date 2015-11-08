var nconf = require('nconf')
  , riotConnector = require('../scripts/riotconnector')

nconf.file('../config.json')

var riot = riotConnector(nconf.get('riot:key'))

/*riot.summoner.byName('na', 'trigoman', function (err, summonerDto) {
 console.log(summonerDto.id)

 })*/

riot.league.bySummonerEntry('na', 25758864, function (err, leagues) {
  if (!err)
    leagues
      .filter(function (league) {
        return league.queue == 'RANKED_SOLO_5x5'
      })
      .forEach(function (league) {
        console.log('Rank: ' + league.tier + ' ' + league.entries[0].division)
      })
  else
    console.log(err)
})
