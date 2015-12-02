/**
* Gulp Packages
*/

// General
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var lib = require('bower-files')();

// Static: Compress JS files into motech.js
gulp.task('js', function () {
    gulp.src(lib.ext('js').files)
        .pipe(concat('motech.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('build/js'));
});