
var fs     = require('fs')
var path   = require('path')
var gulp   = require('gulp')
var babel  = require('gulp-babel')
var concat = require('gulp-concat')
var rimraf = require('gulp-rimraf')


var src  = path.join(__dirname, './src/monfig.js')
var dest = path.join(__dirname, './dist')


var babelconf = JSON.parse(
  fs.readFileSync(path.join(__dirname, './.babelrc'), 'utf8')
)


gulp.task('clean', function() {
  return gulp.src(path.join(dest, '/*'))
    .pipe(rimraf())
})

gulp.task('build', ['clean'], function() {
  return gulp.src(src, {read: true})
    .pipe(babel(babelconf))
    .pipe(concat('monfig.js') )
    .pipe(gulp.dest(dest));
})