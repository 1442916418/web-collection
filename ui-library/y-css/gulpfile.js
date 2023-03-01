const autoprefixer = require('gulp-autoprefixer')
const browserSync = require('browser-sync').create()
const cleanCss = require('gulp-clean-css')
const del = require('del')
const gulp = require('gulp')
const sass = require('gulp-sass')(require('node-sass'))
const wait = require('gulp-wait')
const gulpReplace = require('gulp-replace')

const paths = {
  base: {
    base: './',
    node: './node_modules'
  },
  src: {
    base: './src/',
    css: './src/css',
    scss: './src/scss',
    node_modules: './node_modules/'
  },
  temp: {
    base: './.temp/',
    css: './.temp/css',
    html: './.temp/html',
    assets: './.temp/assets',
    vendor: './.temp/vendor'
  },
  dist: {
    base: './dist'
  }
}

gulp.task('scss', function () {
  return gulp
    .src([paths.src.scss + '/**/*.scss'])
    .pipe(wait(500))
    .pipe(sass().on('error', sass.logError))
    .pipe(
      autoprefixer({
        cascade: true,
        overrideBrowserslist: ['> 1%']
      })
    )
    .pipe(gulp.dest(paths.temp.css))
    .pipe(browserSync.stream())
})

gulp.task('clean:dist', function () {
  return del([paths.dist.base])
})

gulp.task('dist:css', function () {
  return (
    gulp
      .src([paths.src.scss + '/**/*.scss'])
      .pipe(wait(500))
      .pipe(sass().on('error', sass.logError))
      .pipe(
        autoprefixer({
          cascade: true,
          overrideBrowserslist: ['> 1%']
        })
      )
      .pipe(cleanCss())
      // TODO: 去除 !important ???
      .pipe(gulpReplace('!important', ''))
      .pipe(gulp.dest(paths.dist.base))
  )
})

gulp.task(
  'serve',
  gulp.series('scss', function () {
    gulp.watch([paths.src.scss + '/**/*.scss'], gulp.series('scss'))
  })
)

gulp.task('default', gulp.series('serve'))
gulp.task('build', gulp.series('clean:dist', 'dist:css'))
