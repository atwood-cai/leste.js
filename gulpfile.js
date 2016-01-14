var gulp = require('gulp'),
    fs = require('fs'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    plugins = gulpLoadPlugins();

var files = [
    ['core', 'core.js'],

    ['date', 'date.default.js'],

    ['element', 'element.default.js'],
    ['element', 'element.manipulation.js', 2],
    ['element', 'element.classlist.js', 2],

    ['nodelist', 'nodelist.default.js'],

    ['event', 'event.default.js'],
    ['event', 'event.touch.js', 6],

    ['other', 'polyfill.promise.js'],
    ['other', 'polyfill.fetch.js', 8]
];

gulp.task('concat-all', function() {

    var fileList = files.map(file => 'src/' + file[0] + '/' + file[1]);
    var path = 'dist/';
    gulp.src(fileList)
    .pipe(plugins.concat('leste.js'))
    .pipe(gulp.dest(path));

    gulp.src(fileList)
    .pipe(plugins.uglify())
    .pipe(plugins.concat('leste.min.js'))
    .pipe(gulp.dest(path));
});

gulp.task('generate-filelist', function() {

    fs.writeFileSync('../leste_js_filelist_tmp.js', 'var fileList = ' + JSON.stringify(files));

});


gulp.task('default', ['concat-all', 'generate-filelist']);
