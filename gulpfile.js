var gulp = require('gulp'),
    fs = require('fs'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    plugins = gulpLoadPlugins();

var files = [
    ['core', 'core.js'],

    ['date', 'date.default.js'],

    ['element', 'element.default.js'],
    ['element', 'element.manipulation.js', ['element.default.js']],
    ['element', 'element.classlist.js', ['element.default.js']],

    ['nodelist', 'nodelist.default.js'],

    ['event', 'event.default.js'],
    ['event', 'event.touch.js', ['event.default.js']],

    ['async', 'async.ajax.js'],

    ['other', 'polyfill.promise.js'],
    ['other', 'polyfill.fetch.js', ['polyfill.promise.js']]
];

gulp.task('concat-all', function() {

    var fileList = files.map(file => 'src/' + file[0] + '/' + file[1]);
    var path = 'dist/';
    gulp.src(fileList)
    .pipe(plugins.concat('leste.js'))
    .pipe(gulp.dest(path));


    var tmpPath = 'leste_js_filelist/';
    try {
        fs.mkdirSync(tmpPath);
    } catch(e) {
    }
    gulp.src(fileList)
    .pipe(gulp.dest(tmpPath))
    .pipe(plugins.uglify())
    .pipe(plugins.concat('leste.min.js'))
    .pipe(gulp.dest(tmpPath));

    gulp.src(fileList)
    .pipe(plugins.uglify())
    .pipe(plugins.concat('leste.min.js'))
    .pipe(gulp.dest(path));
});

gulp.task('generate-filelist', function() {

    fs.writeFileSync('../leste_js_filelist_tmp.js', 'var fileList = ' + JSON.stringify(files));

});

gulp.task('default', ['concat-all', 'generate-filelist']);
