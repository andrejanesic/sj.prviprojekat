const gulp = require('gulp');
const clean = require('gulp-clean');
const sass = require('gulp-sass')(require('sass'));
const exec = require('child_process').exec;

const RES = 'res/';
const PUBLIC = 'public/';

/* Clean */

function cleanEjs() {
    return gulp
        .src(PUBLIC + 'views', {read: false, allowEmpty: true})
        .pipe(clean());
}

function cleanCss() {
    return gulp
        .src(PUBLIC + 'css', {read: false, allowEmpty: true})
        .pipe(clean());
}

function cleanAll() {
    return gulp.series(cleanEjs);
}

/* Copy */

function copyEjs() {
    return gulp
        .src(RES + 'views/*')
        .pipe(gulp.dest(PUBLIC + 'views'));
}

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

exports.dev = function () {
    gulp.watch('res/views/**/*.ejs', gulp.series(cleanEjs, copyEjs));
    gulp.watch('res/sass/**/*.scss', gulp.series(cleanCss, buildSass, tailwind));
}
exports.build = gulp.series(cleanAll, copyEjs, tailwind);
exports.default = exports.build;