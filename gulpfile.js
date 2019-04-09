const gulp = require('gulp')
const filter = require('gulp-filter')
const ts = require('gulp-typescript')
const tsProject = ts.createProject('tsconfig.json')
const del = require('del')

function clean(cb) {
  del.sync(['dist/**/*.d.ts', 'js/*', '!js/api/', '!js/api/**' ])

  cb()
}

async function build(cb) {
  const compiled = gulp.src('src/**/*.ts').pipe(tsProject())

  await Promise.all([
    // compiled templates don't need to be shipped.
    new Promise((resolve, reject)=>{
      compiled.js
        .pipe(filter(['**', '!src/templates/**']))
        .pipe(gulp.dest('cargo'))
        .on('error', reject)
        .on('end', resolve)
    }),
    // user will need compiled templates.
    new Promise((resolve, reject)=>{
      compiled.js
        .pipe(filter(['src/templates/**']))
        .pipe(gulp.dest('dist'))
        .on('error', reject)
        .on('end', resolve)
    }),
    new Promise((resolve, reject)=>{
      compiled.dts
        .pipe(gulp.dest('dist'))
        .on('error', reject)
        .on('end', resolve)
    })
  ])

  cb()
}

exports.clean = clean
exports.default = gulp.series(clean, build)