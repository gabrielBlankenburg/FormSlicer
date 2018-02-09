var gulp = require('gulp');
var livereload = require('gulp-livereload')
var uglify = require('gulp-uglifyjs');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var babel = require("gulp-babel");

gulp.task('imagemin', function () {
    return gulp.src('')
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{
            removeViewBox: false
        }],
        use: [pngquant()]
    }))
    .pipe(gulp.dest(''));
});

gulp.task('sass', function () {
    gulp.src('./src/sass/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
        outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(sourcemaps.write('./src/'))
    .pipe(gulp.dest('./src/css'));
});

gulp.task('uglify', function () {
    gulp.src('./src/js/*.js')
    .pipe(uglify('main.js'))
    .pipe(gulp.dest('./dist/js'))
});

gulp.task('es6', function(){
    return gulp.src('./src/js/*.js')
        .pipe(babel())
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('watch', function () {
    livereload.listen();

    gulp.watch('./src/sass/**/*.scss', ['sass']);
    gulp.watch('./src/js/*.js', ['es6']);
    gulp.watch(['./src/css/estilo.css', './src/js/*.js', '**/*.html'], function (files) {
        livereload.changed(files)
    });
});