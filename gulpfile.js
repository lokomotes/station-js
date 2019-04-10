const path = require('path').posix // https://github.com/gulpjs/gulp/issues/1847
const fs = require('fs')
const gulp = require('gulp')
// const debug = require('gulp-debug');
const filter = require('gulp-filter')
const ts = require('gulp-typescript')
const tsProject = ts.createProject('tsconfig.json')
const del = require('del')

const CARGO = 'cargo'
const DIST = 'dist'

let compiled = undefined;

function clean(cb) {
  del.sync([
    'dist/**/*.d.ts',
    'dist/**/*.js',
    path.join(CARGO, '*'),
    '!' + path.join(CARGO, 'api'),
    '!' + path.join(CARGO, 'api/**'),
  ])

  cb()
}

function build(cb) {
  compiled = gulp.src('src/**/*.ts')
    .pipe(tsProject())

  cb();
}

async function ship(cb) {
  // TODO: $CARGO/api not exits at first time; create it.

  await Promise.all([
    // compiled templates don't need to be shipped.
    new Promise((resolve, reject) => {
      compiled.js
        .pipe(filter([
          '**', '!src/templates/**']))
        .pipe(gulp.dest(CARGO))
        .on('error', reject)
        .on('end', resolve)
    }),
    // user will need compiled templates.
    new Promise((resolve, reject) => {
      compiled.js
        .pipe(filter([
          'src/templates/**']))
        .pipe(gulp.dest(DIST))
        .on('error', reject)
        .on('end', resolve)
    }),
    new Promise((resolve, reject) => {
      compiled.dts
        .pipe(gulp.dest(DIST))
        .on('error', reject)
        .on('end', resolve)
    })
  ])

  // ship implementations.
  await new Promise((resolve, reject) => {
    gulp.src(path.join(CARGO, '**'))
      .pipe(filter([
        'api/**',
        'index.js',
        'errors.js',
        'types.js',
        'StationDesc.js',
        'templates.js']
        .map((v) => path.join(CARGO, v))))
      .pipe(gulp.dest(DIST))
      .on('error', reject)
      .on('end', resolve)
  })

  fs.writeFileSync('dist/Station.js', "true;\n")

  await new Promise((resolve, reject) => {
    gulp.src(path.join(DIST, '**'))
      .pipe(gulp.dest(path.join(CARGO, 'app/node_modules/@lokomotes/station')))
      .on('error', reject)
      .on('end', resolve)
  })

  // fs.closeSync(fs.openSync('dist/Station.js', 'w'))

  cb()
}

exports.clean = clean
exports.default = gulp.series(clean, build, ship)