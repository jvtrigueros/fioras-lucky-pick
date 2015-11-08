'use strict'

var passport = require('passport')
  , Auth0Strategy = require('passport-auth0')
  , nconf = require('nconf')

function createStrategy() {
  return new Auth0Strategy( { domain:       nconf.get('auth:domain')
                            , clientID:     nconf.get('auth:audience')
                            , clientSecret: nconf.get('auth:secret')
                            , callbackURL:  nconf.get('baseurl') + '/callback'
                            }
                          , function(accessToken, refreshToken, extraParams, profile, done) {
                              // accessToken is the token to call Auth0 API (not needed in the most cases)
                              // extraParams.id_token has the JSON Web Token
                              // profile has all the information from the user
                              return done(null, profile)
                            }
                          )
}

var strategy = createStrategy()

passport.use(strategy)

// This is not a best practice, but we want to keep things simple for now
passport.serializeUser(function(user, done) {
  done(null, user)
})

passport.deserializeUser(function(user, done) {
  done(null, user)
})

module.exports = strategy