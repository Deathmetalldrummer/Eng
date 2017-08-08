// Blacklist    https://github.com/gulpjs/plugins/blob/master/src/blackList.json
var gulp = require('gulp'),
    jade = require('gulp-jade'),
    pug = require('gulp-pug'),
    sass = require('gulp-sass'),
    plumber = require('gulp-plumber'),
    rename = require("gulp-rename"),
    browserSync = require('browser-sync'),
    autoprefixer = require('gulp-autoprefixer'),
    mini = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    del = require('del'),
    spritesmith = require('gulp.spritesmith'),
    imagemin = require('gulp-imagemin'),
    runSequence = require('run-sequence');

var pathDev = 'Source/Development/',
       pathCom = 'Source/Completed/';

var prefix = {
          browsers: ['last 5 versions'],
          cascade: false
      }


///////////////////////////////////////////////////////////////////////////////////////
//                                                              JADE
///////////////////////////////////////////////////////////////////////////////////////
gulp.task('jade',function() {
  return gulp.src(pathDev+'**/*.jade')
  .pipe(plumber())
  .pipe(jade({pretty: true}))
  .pipe(gulp.dest(pathCom))
});


///////////////////////////////////////////////////////////////////////////////////////
//                                                              SASS
///////////////////////////////////////////////////////////////////////////////////////
gulp.task('sass',function() {
  return gulp.src(pathDev+'**/*.sass')
  .pipe(plumber())
  .pipe(sass().on('error', sass.logError))
  .pipe(autoprefixer(prefix))
  .pipe(gulp.dest(pathCom))
});


///////////////////////////////////////////////////////////////////////////////////////
//                                                              JAVASCRIPT
///////////////////////////////////////////////////////////////////////////////////////
gulp.task('js', function() {
  return gulp.src(pathDev+'**/*.js')
  .pipe(gulp.dest(pathCom))
});




///////////////////////////////////////////////////////////////////////////////////////
//                                                              COPY
///////////////////////////////////////////////////////////////////////////////////////
gulp.task('copy', function() {
  return gulp.src([pathDev+'**/*.*', '!**/*.{sass,js,jade}'])
  .pipe(gulp.dest(pathCom))
});


///////////////////////////////////////////////////////////////////////////////////////
//                                                              CLEAN
///////////////////////////////////////////////////////////////////////////////////////
gulp.task('clean', function() {
    del(pathCom);
});


///////////////////////////////////////////////////////////////////////////////////////
//                                                              SERVER
///////////////////////////////////////////////////////////////////////////////////////
gulp.task('server', function () {
  browserSync({
    port: 9000,
    server: {
      baseDir: pathCom
    }
  });
});


///////////////////////////////////////////////////////////////////////////////////////
//                                                              WATCHING
///////////////////////////////////////////////////////////////////////////////////////
gulp.task('watching', function() {
    gulp.watch(pathCom+'**/*.{html,css,js}').on('change', browserSync.reload);
    gulp.watch(pathDev+'**/*.{sass,scss}', ['sass']);
    gulp.watch(pathDev+'**/*.jade', ['jade']);
    gulp.watch(pathDev+'**/*.js', ['js']);
});

///////////////////////////////////////////////////////////////////////////////////////
//                                                              RUN
///////////////////////////////////////////////////////////////////////////////////////
// dev
gulp.task('dev',['jade','sass','js','copy']);

// serv
gulp.task('serv', ['server','watching']);

// default
gulp.task('default', ['dev','server','watching']);
