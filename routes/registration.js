var express = require('express')
var router = express.Router()

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

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('registration', { regions: regions, roles: roles })
})

module.exports = router
