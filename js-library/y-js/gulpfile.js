const gulp = require('gulp')
const gulpUglify = require('gulp-uglify')

const paths = {
  enter: {
    base: './src/',
    js: './src/*.js'
  },
  output: {
    base: './dist/',
    js: './dist/'
  }
}

gulp.task('build', function () {
  return gulp.src([paths.enter.js]).pipe(gulpUglify()).pipe(gulp.dest(paths.output.js))
})
