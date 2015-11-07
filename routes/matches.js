var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('matches', { title: "Fiora's Lucky Pick",welcome: "Hi Please review your matches:"});

});

module.exports = router;
