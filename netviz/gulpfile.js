const sourcemaps  = require('gulp-sourcemaps');
const gulp        = require('gulp');
const gutil       = require('gulp-util');
const sass        = require('gulp-sass');
const browserSync = require('browser-sync').create();
const source      = require('vinyl-source-stream');
const buffer      = require('vinyl-buffer');
const browserify  = require('browserify');
const babelify    = require('babelify');
const url         = require('url');
const proxy       = require('proxy-middleware');

// compile the javascript bundle
gulp.task('js', (done) => {
	browserify('./app/js/app.js')
		.transform("babelify", {presets: ['es2015']})
		.bundle()
		.on('error', gutil.log)
		.pipe(source('bundle.js'))
		.pipe(buffer())
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./dest/js/'))
		.pipe(browserSync.reload({ stream: true }));
	done();
});

// Copy html files from `app` to `dest`
gulp.task('html', (done) => {
	gulp.src('./app/**/*.html')
		.pipe(gulp.dest('./dest/'))
		.pipe(browserSync.reload({ stream: true }));
	done();
});

// Compile SASS to CSS
gulp.task('sass', (done) => {
	gulp.src('./app/scss/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./dest/css/'))
		.pipe(browserSync.reload({ stream: true }));
	done();
});

// Task for starting the dev setup and watching for changes
gulp.task('server', gulp.series(['js', 'html', 'sass'], (done) => {
	gulp.watch('./app/js/**/*.js', gulp.series(['js']));
	gulp.watch('./app/scss/**/*.scss', gulp.series(['sass']));
	gulp.watch('./app/**/*.html', gulp.series(['html']));

	const proxyOptions = url.parse('http://localhost:5000');
	proxyOptions.route = '/api';

	browserSync.init({
		server:  {
			baseDir: './dest/',
			middleware: [proxy(proxyOptions)]
		}
	});
	done();
}));

// Build javascript, html and sass
gulp.task('build', gulp.series(['js', 'html', 'sass']));

gulp.task('default', gulp.series(['build']));