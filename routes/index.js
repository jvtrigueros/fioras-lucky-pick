var express = require('express')
  , router = express.Router()

router.get('/', function(req, res, next) {
  res.render('index', { title: "Fiora's Lucky Pick", layout: false })
})

module.exports = router
