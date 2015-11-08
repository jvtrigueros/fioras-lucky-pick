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
  , session = require('express-session')

// Needs a config.json with all the keys, please look at config.sample.json for structure
nconf.file('config.json')

var routes = require('./routes/index')
var matches = require('./routes/matches')
var registration = require('./routes/registration')
var profile = require("./routes/profile")

var app = express()
  , MongoClient = mongodb.MongoClient
  , strategy = require('./scripts/auth-strategy')

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
app.use(session({secret: 'shhh', saveUninitialized: false, resave: false}))
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')))
app.use(passport.initialize())
app.use(passport.session())

app.use('/', routes)
app.use('/matches', matches)
app.use('/registration', registration)
app.use('/profile', profile)

app.get('/callback', passport.authenticate('auth0', {failureRedirect: '/'}),
  function (req, res) {
    if (!req.user) {
      throw new Error('user null')
    }

    // Determine if user exists already or not
    MongoClient.connect('mongodb://' + nconf.get('db:user') + ':' + nconf.get('db:pass') + '@' + nconf.get('db:url'), function (err, db) {
      if(err)
        console.log('Could not connect to database: ' + nconf.get('db:url'))
      else {
        var summonersCollection = db.collection('summoners')

        var cursor = summonersCollection.find({_id: req.user.id})

        cursor.limit(1).toArray(function (err, result) {
          if(err)
            console.log('Could not turn find result into Array: ', err)
          else if(result.length)
            res.redirect("/profile")
          else
            res.redirect("/registration")
        })
      }
    })
})

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
