var config = require('../config');
var gulp = require('gulp');
var nunjucks = require('gulp-nunjucks');
var path = require('path');

var paths = {
    src: path.join(config.root.src, 'pages/*.html'),
    dest: path.join(config.root.dest, 'pages')
};

gulp.task('pages', function() {
    gulp.src(paths.src)
        .pipe(nunjucks.compile({
            staticPath: config.staticPath
        }))
        .pipe(gulp.dest(paths.dest));
});