var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

/////////////
// OPTIONS //
/////////////

// enable extra debug information, when possible
var __DEBUG = true;
// enable sourcemaps for Browserify bundles and Sass
var __SOURCEMAPS = true;
// clean dist files before (re)builds
var __CLEAN = true;
// minify .css and .js files
var __MINIFY = true;

///////////
// PATHS //
///////////

// SOURCE PATH OPTIONS
var __SRC = './src';
var __SRC_BROWSERIFY = [__SRC + '/js/**/**.browserify.js'];
var __SRC_SASS = [
	__SRC + '/sass/**/*.scss',
	// Ignore partials (file names prefixed with _)
	'!' + __SRC + '/sass/**/_*.scss'
];

// WATCH PATHS
var __WATCH_SASS = [__SRC + '/sass/**/**.scss'];
var __WATCH_BROWSERIFY = __SRC_BROWSERIFY;

// DIST PATH OPTIONS
var __DIST = './dist';
var __DIST_JS = __DIST + '/js';
var __DIST_CSS = __DIST + '/css';

// CLEAN PATHS
// clean Browserify bundles
var __CLEAN_BROWSERIFY = [
	// Bundles
	__DIST_JS + '/**/**.browserify.js',
	// Minified bundles
	__DIST_JS + '/**/**.browserify.min.js',
	// .map files
	__DIST_JS + '/**/**.browserify.js.map',
	__DIST_JS + '/**/**.browserify.min.js.map'
];
var __CLEAN_CSS = __DIST_CSS;

/////////////////
// CLEAN TASKS //
/////////////////

var del = require('del');

// CLEAN DIST JS BROWSERIFY BUNDLES
gulp.task('clean-browserify', function (cb) {
	if (!__CLEAN) {
		return cb()
	}
	del(__CLEAN_BROWSERIFY).then(function () {
		cb()
	});
});

// CLEAN DIST CSS
gulp.task('clean-css', function (cb) {
	if (!__CLEAN) {
		return cb()
	}
	del(__CLEAN_CSS).then(function () {
		cb()
	});
});

////////////////
// SASS TASKS //
////////////////

// Compile Sass
gulp.task('sass', ['clean-css'], function () {
	return gulp.src(__SRC_SASS)
		// (optional) sourcemaps
		.pipe($.if(__SOURCEMAPS, $.sourcemaps.init()))
		// Compile Sass
		.pipe($.sass({ 
			// Resolve Sass file imports from node_modules
			importer: require('sass-importer-npm') 
		})
		// Handle errors
		.on('error', $.sass.logError))
		// Post CSS
		.pipe($.postcss([
			// autoprefixer
			require('autoprefixer')({ browsers: ['last 2 versions'] })
		]))
		// (optional) Minify CSS
		.pipe($.if(__MINIFY, $.rename({ extname: '.min.css' })))
		.pipe($.if(__MINIFY, $.cleanCss()))
		// (optional) Write .map file
		.pipe($.if(__SOURCEMAPS, $.sourcemaps.write('./')))
		// Write CSS file
		.pipe(gulp.dest(__DIST_CSS))
});

// Watch Sass
gulp.task('sass:watch', ['watch:set'], function () {
	gulp.watch(__WATCH_SASS, ['sass']);
});

////////////////
// BROWSERIFY //
////////////////

// BROWSERIFY DEPENDENCIES
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var globby = require('globby');
var path = require('path');
var assign = require('lodash.assign');

/**
 * bundleLogger
 * Provides logs for browserify bundles
 */
var prettyHrtime = require('pretty-hrtime');
var _startTime;
var bundleLogger = {
	start: function (filepath) {
		_startTime = process.hrtime();
		$.util.log('Bundling', $.util.colors.green(filepath) + '...');
	},
	end: function (filepath) {
		var taskTime = process.hrtime(_startTime);
		var prettyTime = prettyHrtime(taskTime);
		$.util.log('Bundled', $.util.colors.green(filepath), 'in', $.util.colors.magenta(prettyTime));
	}
}

// Compile Browserify bundles
gulp.task('browserify', ['clean-browserify'], function (callback) {

	globby(__SRC_BROWSERIFY).then(function (bundles) {
		
		var bundleQueue = bundles.length;
		bundles = bundles.map(function (bundle) {
			return {
				src: bundle,
				dest: __DIST_JS,
				bundleName: path.basename(bundle)
			}
		});

		var browserifyThis = function (bundleConfig) {
			var opts = assign({}, watchify.args, {
				// Specify the entry point of your app
				entries: bundleConfig.src,
				// Enable source maps!
				debug: __DEBUG,
				paths: [
					// Resolve files from node_modules
					path.resolve(__dirname, 'node_modules')
				]
			});
			var bundler = browserify(opts);

			var bundle = function () {
				// Log when bundling starts
				bundleLogger.start(path.join(bundleConfig.dest, bundleConfig.bundleName));

				return bundler
					.bundle()
					// Report compile errors
					.on('error', $.util.log)
					// Use vinyl-source-stream to make the
					// stream gulp compatible. Specifiy the
					// desired output filename here.
					.pipe(source(bundleConfig.bundleName))
					// buffer file contents
					.pipe(buffer())
					// (optional) sourcemaps
					// loads map from browserify file
					.pipe($.if(__SOURCEMAPS, $.sourcemaps.init({ loadMaps: true })))
					// Add transformation tasks to the pipeline here.
					// (optional) Minify CSS
					.pipe($.if(__MINIFY, $.rename({ extname: '.min.js' })))
					.pipe($.if(__MINIFY, $.uglify()))
					// (optional) Write .map file
					.pipe($.if(__SOURCEMAPS, $.sourcemaps.write('./')))
					// Write JS file
					.pipe(gulp.dest(bundleConfig.dest))
					.on('end', reportFinished)
			};

			if (global.__WATCHING) {
				// Wrap with watchify and rebundle on changes
				bundler = watchify(bundler);
				// Rebundle on update
				bundler.on('update', bundle);
			}

			var reportFinished = function () {
				// Log when bundling completes
				bundleLogger.end(path.join(bundleConfig.dest, bundleConfig.bundleName));

				if (bundleQueue) {
					bundleQueue --;
					if (bundleQueue === 0) {
						// If queue is empty, tell gulp the task is complete.
						// https://github.com/gulpjs/gulp/blob/master/docs/API.md#accept-a-callback
						callback();
					}
				}
			};

			return bundle();
		};

		// Start bundling source files with Browserify
		bundles.forEach(browserifyThis);
	});
});

// Watch Browserify Bundles
gulp.task('browserify:watch', ['watch:set'], function () {
	gulp.watch(__WATCH_BROWSERIFY, ['browserify']);
});

/////////////
// GENERAL //
/////////////

// Called before running any watcher
// Sets a global __WATCHING flag
gulp.task('watch:set', function (cb) {
	global.__WATCHING = true
	cb()
});

// Watchers
gulp.task('watch', ['sass:watch', 'browserify:watch']);

// Default
gulp.task('default', ['sass', 'browserify']);