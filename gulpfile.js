const gulp = require('gulp');
const clean = require('gulp-clean');
const sass = require('gulp-sass')(require('sass'));
const exec = require('child_process').exec;
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');

const RES = 'res/';
const PUBLIC = 'public/';

/* Clean */

function cleanCss() {
    return gulp
        .src(PUBLIC + 'css', {read: false, allowEmpty: true})
        .pipe(clean());
}

function cleanAll() {
    return gulp.series(cleanEjs);
}

/* Copy */

/* Sass */

function buildSass() {
    return gulp.src(RES + 'sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(PUBLIC + 'css'));
}

/* Tailwind */

function tailwind(cb) {
    exec(
        'npx tailwindcss -i ' +
        PUBLIC +
        'css/admin/style.css' +
        ' -o ' +
        PUBLIC +
        'css/admin/style.css',
        function (err, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
            cb(err);
        });
}

/* JS */

function concatJs(cb) {
    return gulp
        .src(RES + 'js/**/*.js')
        .pipe(concat('index.js'))
        .pipe(gulp.dest(PUBLIC + 'js'));
}

function uglifyJs(cb) {
    return gulp
        .src(PUBLIC + 'js/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest(PUBLIC + 'js'));
}

exports.dev = function () {
    gulp.watch(RES + 'js/**/*.js', gulp.series(concatJs))
    gulp.watch(RES + 'views/**/*.ejs', gulp.series(cleanCss, buildSass, tailwind));
    gulp.watch(RES + 'sass/**/*.scss', gulp.series(cleanCss, buildSass, tailwind));
}
exports.build = gulp.series(cleanAll, tailwind);
exports.default = exports.build;