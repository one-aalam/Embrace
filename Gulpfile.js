var gulp = require('gulp')
, nodemon = require('gulp-nodemon')
, jshint = require('gulp-jshint')

gulp.task('lint', function () {
  gulp.src('./**/*.js')
  .pipe(jshint())
})

gulp.task('develop', function () {
  nodemon(
        {
          script: 'server.js',
          env: { 'NODE_ENV': 'development' } ,
          ext: 'html js',
          ignore: ['./build/**'],
          nodeArgs: ['--debug']
          })
  .on('change', ['lint'])
  .on('restart', function () {
    console.log('Embrace restarted!')
  })
})
