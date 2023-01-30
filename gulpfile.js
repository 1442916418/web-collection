const autoprefixer = require('gulp-autoprefixer')
const browserSync = require('browser-sync').create()
const cleanCss = require('gulp-clean-css')
const del = require('del')
const htmlmin = require('gulp-htmlmin')
const cssbeautify = require('gulp-cssbeautify')
const gulp = require('gulp')
const npmDist = require('gulp-npm-dist')
const sass = require('gulp-sass')(require('node-sass'))
const wait = require('gulp-wait')
const sourcemaps = require('gulp-sourcemaps')
const fileinclude = require('gulp-file-include')
const childProcess = require('child_process')

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
  }
}

gulp.task('scss', function () {
  return gulp
    .src([paths.src.scss + '/neumorphism/**/*.scss', paths.src.scss + '/neumorphism.scss'])
    .pipe(wait(500))
    .pipe(sass().on('error', sass.logError))
    .pipe(
      autoprefixer({
        cascade: true,
        overrideBrowserslist: ['> 1%']
      })
    )
    .pipe(cleanCss())
    .pipe(gulp.dest(paths.temp.css))
    .pipe(browserSync.stream())
})

gulp.task(
  'serve',
  gulp.series('scss', function () {
    // browserSync.init({
    //   server: paths.temp.base
    // })
    gulp.watch([paths.src.scss + '/neumorphism/**/*.scss', paths.src.scss + '/neumorphism.scss'], gulp.series('scss'))
  })
)

gulp.task('default', gulp.series('serve'))
