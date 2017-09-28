var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var browserSync = require('browser-sync').create();
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var imagemin = require('gulp-imagemin');
var imageminJpegtran = require('imagemin-jpegtran');
var imageminOptipng = require('imagemin-optipng');
var media = require('gulp-pipe-media');
var imagesLoaded = require('imagesloaded');

var config = {
  src:  'src',
  dist: 'dist'
}

media.init(gulp, {
  base: undefined,
  dest: undefined,
  watch: true,
  images: {
    src: config.src+'/assets/img/**/*',
    dest: `${config.dist}/assets/img`,
    watch: {
      files: config.src+'/assets/img/**/*'
    },
    imagemin: {
      plugins: [
        imagemin.gifsicle({interlaced: true}),
        imagemin.jpegtran({progressive: true}),
        imagemin.optipng({optimizationLevel: 7}),
        imagemin.svgo({plugins: [{removeViewBox: true}]})
      ],
      options: {verbose: true}
    }
  },
  videos: {
    src: config.src+'/assets/videos/**/*',
    dest: `${config.dist}/assets/video`
  },
  fonts: {
    src: config.src+'/assets/fonts/**/*',
    dest: `${config.dist}/assets/fonts`,
    watch: {
      files: config.src+'/assets/fonts/**/*'
    },
  }
});

gulp.task('minify', function() {
  return gulp.src(config.src+'/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(config.dist))
    .pipe(browserSync.stream());
});

gulp.task('scss', function () {
  return gulp.src(config.src+'/assets/scss/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(rename('main.min.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.dist+'/assets/css/'))
    .pipe(browserSync.stream());
});

function bundle (bundler) {
  bundler
    .bundle()
    .pipe(source(config.src+'/assets/js/main.js'))
    .pipe(buffer())
    .pipe(rename('main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(config.dist+'/assets/js/'))
    .pipe(browserSync.stream());
}

gulp.task('js', function () {
  const bundler = browserify(config.src+'/assets/js/main.js')
    .transform(babelify, {
      presets : ['es2015']
    });
  bundle(bundler);
});

gulp.task('watch', function() {
  browserSync.init({
    server: './'+config.dist
  });
  gulp.watch(config.src+'/*.html', ['minify']);
  gulp.watch(config.src+'/assets/scss/**/*.scss', ['scss']);
  gulp.watch(config.src+'/assets/js/**/*.js', ['js']);
  gulp.watch(config.src+'/assets/img/**/*', ['media']);
  gulp.watch(config.src+'/assets/fonts/**/*', ['media']);
});

gulp.task('default', [ 'watch', 'minify', 'scss', 'js', 'media' ]);
