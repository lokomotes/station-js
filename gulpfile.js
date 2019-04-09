const gulp = require('gulp');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');
const del = require('del')

function clean(cb) {
  del.sync(["dist/", "types/*.d.ts", "types/app/*.d.ts"])

  cb()
}

function build(cb) {
  let compiled = tsProject.src()
    .pipe(tsProject())
    
  compiled.js.pipe(gulp.dest("dist"));
  compiled.dts.pipe(gulp.dest("dts"));

  gulp.src("src/api").pipe(gulp.dest("dts"))

  cb()
}

exports.default = gulp.series(clean, build)