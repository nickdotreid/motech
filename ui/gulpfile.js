/**
* Gulp Packages
*/

// General
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var lib = require('bower-files')();
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');

// Static: Compress JS files into motech.js
gulp.task('js', function () {
    var files = lib.ext('js').files; // libraries from bower
    files.push('src/js/*.js'); // common files

    gulp.src(files)
        .pipe(sourcemaps.init())
          .pipe(concat('motech.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/js'))
        .pipe(uglify())
        .pipe(rename('motech.min.js'))
        .pipe(gulp.dest('build/js'));
});