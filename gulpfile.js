'use strict'

var gulp = require('gulp')
  , browserSync = require('browser-sync').create()
  , nodemon = require('gulp-nodemon')

var BROWSER_SYNC_RELOAD_DELAY = 100

gulp.task('default', ['browser-sync'])

gulp.task('browser-sync', ['nodemon'], function () {
  browserSync.init({ proxy: 'http://localhost:3000'
                   , files: [ 'public/**/*.*' ]
                   , port: 7000
                   })
})

gulp.task('nodemon', function (cb) {

  var called = false

  var options = { script: 'bin/www'
                , watch: [ 'views/*.hbs'
                         , 'routes/*.js'
                         , 'bin/www'
                         ]
                }

  return nodemon(options)
    .on('start', function onStart() {
        if (!called) cb()

        called = true
      })
    .on('restart', function onRestart() {
        setTimeout(function reload() {
          browserSync.reload({stream: false})
        }, BROWSER_SYNC_RELOAD_DELAY)
      })
})