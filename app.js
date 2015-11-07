var express = require('express')
  , bodyParser = require('body-parser')
  , cookieParser = require('cookie-parser')
  , cors = require('cors')
  , favicon = require('serve-favicon')
  , jwt = require('express-jwt')
  , logger = require('morgan')
  , nconf = require('nconf')
  , path = require('path')

// Needs a config.json with all the keys, please look at config.sample.json for structure
nconf.file('config.json')

var routes = require('./routes/index')
var users = require('./routes/users')
var matches = require('./routes/matches')

var authenticate = jwt({ secret: new Buffer(nconf.get('auth:secret'), 'base64')
                       , audience: nconf.get('auth:audience')
                       })

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')))

app.configure(function () {
  app.use('/secured', authenticate)
})

app.use('/', routes)
app.use('/users', users)
app.use('/matches', matches)
app.use('/registration', registration)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err
    })
  })
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})


module.exports = app
