var express = require('express')
var router = express.Router()

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: "Fiora's Lucky Pick", layout: false })
})

module.exports = router
