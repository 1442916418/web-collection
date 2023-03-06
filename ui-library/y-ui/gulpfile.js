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
const gulpUglify = require('gulp-uglify')

const paths = {
  base: {
    base: './'
  },
  src: {
    base: './src/',
    css: './src/css',
    scss: './src/scss',
    index: './src/index.js',
    components: './src/components/**/*.js'
  },
  temp: {
    base: './.temp/',
    css: './.temp/css',
    html: './.temp/html',
    assets: './.temp/assets',
    vendor: './.temp/vendor'
  },
  build: {
    base: './dist/',
    components: './dist/components/'
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

gulp.task('clean:dist', function () {
  return del([paths.build.base])
})

gulp.task('copy:index', function () {
  return gulp.src([paths.src.index]).pipe(gulpUglify()).pipe(gulp.dest(paths.build.base))
})

gulp.task('copy:components', function () {
  return gulp.src([paths.src.components]).pipe(gulpUglify()).pipe(gulp.dest(paths.build.components))
})

gulp.task('default', gulp.series('serve'))
gulp.task('build', gulp.series('clean:dist', 'copy:index', 'copy:components'))
