var gulp = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    minifycss = require('gulp-minify-css'),
    inline = require('gulp-inline'),
    minifyHTML = require('gulp-minify-html'),
    plugins = gulpLoadPlugins();

gulp.task('default', function() {
    gulp.src('html/*.html')
        .pipe(inline({
            js: plugins.uglify,
            css: minifycss
        }))
        .pipe(minifyHTML())
        .pipe(gulp.dest('./'))
});
