var gulp = require('gulp')
    , concat = require('gulp-concat')
    , uglify = require('gulp-uglify')
    , util = require('gulp-util')
    , jshint = require('gulp-jshint')
    , size = require('gulp-size')
    , connect = require('gulp-connect')
    , replace = require('gulp-replace')
    , htmlv = require('gulp-html-validator')
    , sass = require('gulp-sass')
    , minifyCss = require('gulp-minify-css')
    , concatCss = require('gulp-concat-css')
    , browserify = require('browserify')
    , source = require('vinyl-source-stream')
    , buffer = require('vinyl-buffer');


var srcDir = './src/';

/**
 * Compiles all the files in src/ into Zhart.js and Zhart.min.js
 * note: Zhart.Core.js has to be first.
 */
//gulp.task('build', function () {
//    var srcFiles = [srcDir + 'Zhart.Core.js'];
//    srcFiles.push(srcDir + 'Zhart.helpers.js');
//    var outputDir = '.';
//
//    srcFiles.push(srcDir+'*');
//
//    util.log(srcFiles);
//
//    return gulp.src(srcFiles)
//        .pipe(concat('Zhart.js'))
//        .pipe(gulp.dest(outputDir))
//        .pipe(uglify({preserveComments: 'some'}))
//        .pipe(concat('Zhart.min.js'))
//        .pipe(gulp.dest(outputDir));
//});

gulp.task('build', function() {
    var outputDir = '.';

    return browserify(srcDir + 'init.js')
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('./'))
        .pipe(buffer())
        .pipe(uglify({preserveComments: 'some'}))
        .pipe(concat('bundle.min.js'))
        .pipe(gulp.dest(outputDir));
});

gulp.task('buildCss', function () {
    var srcFiles = ['./scss/*'];
    var outputDir = '.';

    srcFiles.push('.tempcss/*');

    return gulp.src(srcFiles)
        .pipe(concatCss('Zhart.css'))
        .pipe(minifyCss({keepBreaks:true}))
        .pipe(gulp.dest(outputDir));
});

gulp.task('jshint', function () {
    return gulp.src(srcDir + '*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('library-size', function () {
    return gulp.src('Chart.min.js')
        .pipe(size({gzip:true}));
});

gulp.task('module-sizes', function(){
    return gulp.src(srcDir + '*.js')
        .pipe(uglify({preserveComments:'some'}))
        .pipe(size({
            showFiles: true,
            gzip: true
        }))
});

gulp.task('sass', function () {
    return gulp.src('./scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('.tempcss'));
});

gulp.task('watch', function () {
    gulp.watch('./scss/*', ['sass', 'buildCss']);
    gulp.watch('./src/*', ['build']);
});

gulp.task('size', ['library-size', 'module-sizes']);

gulp.task('default', ['build', 'buildCss', 'watch']);

gulp.task('server', function () {
    connect.server({port:8007});
});

gulp.task('dev', ['server', 'default']);