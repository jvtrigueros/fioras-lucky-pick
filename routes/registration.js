/**
 * Created by Daniel on 11/7/2015.
 */
var express = require('express');
var router = express.Router();

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

var roles = [
            "TOP"
            ,"MID"
            ,"JUNGLE"
            ,"ADC"
            ,"SUPPORT"
            ]

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('registration', { regions: regions });
});

module.exports = router;
