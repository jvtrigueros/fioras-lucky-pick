var express = require('express')
  , bodyParser = require('body-parser')
  , cookieParser = require('cookie-parser')
  , cors = require('cors')
  , favicon = require('serve-favicon')
  , logger = require('morgan')
  , mongodb = require('mongodb')
  , nconf = require('nconf')
  , passport = require('passport')
  , path = require('path')
  , requireLogin = require('./scripts/requireLogin')
  , session = require('express-session')
  , strategy = require('./scripts/auth-strategy')

// Needs a config.json with all the keys, please look at config.sample.json for structure
nconf.file('config.json')

var routes = require('./routes/index')
var users = require('./routes/users')
var matches = require('./routes/matches')
var registration = require('./routes/registration')
var profile = require("./routes/profile")

var app = express()

// Local variables
app.locals.clientId = nconf.get('auth:audience')
app.locals.domain = nconf.get('auth:domain')
app.locals.baseurl = nconf.get('baseurl')

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(session({secret: 'shhh'}))
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')))
app.use(passport.initialize())
app.use(passport.session())

app.use('/', routes)
app.use('/users', users)
app.use('/matches', matches)
app.use('/registration', registration)
app.use('/profile', profile)

app.get('/cheese', requireLogin ,function (req, res) {
  res.send('you got the cake ' + req.user.id + '!')
})

app.get('/callback', passport.authenticate('auth0', {failureRedirect: '/url-if-something-fails'}),
  function (req, res) {
    if (!req.user) {
      throw new Error('user null')
    }

    // Determine if user exists already or not

    res.redirect("/registration")
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})
1
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
