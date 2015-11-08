/**
 * Created by Daniel on 11/7/2015.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('profile', { });
});

module.exports = router;
