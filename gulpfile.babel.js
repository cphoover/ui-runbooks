import path from 'path';
import fs from 'fs';

import uglify from 'gulp-uglify';
import rename from 'gulp-rename';
import sourcemaps from 'gulp-sourcemaps';
import runSequence from 'run-sequence';
import less from 'gulp-less';
import concat from 'gulp-concat';

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Bluebird from 'bluebird';
import clean from 'gulp-clean';
import gulp from 'gulp';
import source from 'vinyl-source-stream';
import gulpif from 'gulp-if';
import babel from 'gulp-babel';
import istanbul from 'gulp-babel-istanbul';
import lintspaces from 'gulp-lintspaces';
import eslint from 'gulp-eslint';
import mocha from 'gulp-mocha';
import _ from 'lodash';
import browserify from 'browserify';
import babelify from 'babelify';
import taskListing from 'gulp-task-listing';

import lintspacesrc from 'linting/lintspaces';
import spacesindentrc from 'linting/spaceindent';

const pageWrapper = path.join(__dirname, 'template.html');
const eslintConfigFile = path.join(__dirname, 'node_modules', 'linting', '.eslintrc.json');
const buildDir = path.join(__dirname, 'build');
const pagesDir = path.join(__dirname, 'pages');
const componentsDir = path.join(__dirname, 'components');
const topLevelDirs = '{config,components,pages,lib}'; // these are the dirs that will be scanned

const readFile = Bluebird.promisify(fs.readFile);
const writeFile = Bluebird.promisify(fs.writeFile);

const components = fs.readdirSync(componentsDir) // eslint-disable-line no-sync
	.filter(function (file) {
		return fs.statSync(// eslint-disable-line no-sync
			path.join(componentsDir, file)
		).isDirectory();
	});

const sharedLibs = [
	'react',
	'redux',
	'react-redux',
	'react-dom'
];

const componentLibs = components.map(c => `/components/${c}/${c}.jsx`); // components get bundled in shared

gulp.task(`component:css`, function css() {
	return gulp.src(
			['./main.less'].concat(components.map(c => `./components/${c}/${c}.less`))
		)
		.pipe(less())
		.pipe(concat('main.css'))
		.pipe(gulp.dest(buildDir));
});


gulp.task('clean', function () {
	return gulp.src(['build'], {
		read: false
	})
		.pipe(clean());
});


function handleError(err, msg) {
	console.error(`Uh Oh Looks like something went wrong:\n ${msg || ''}`);
	throw err;
}

gulp.task('bundle:shared', ['clean'], function bundleVendorRun() {
	const bundler = browserify().transform(babelify.configure({
		presets: ['es2015', 'react']
	}));

	sharedLibs.forEach(lib => bundler.require(lib));
	componentLibs.forEach(lib => bundler.require(`.${lib}`, {expose : lib}));
	return bundler.bundle()
		.on('error', err => handleError('issue while bundling shared libs!!!', err))
		.pipe(source('shared.js'))
		.pipe(gulp.dest(buildDir));
});


const pages = fs.readdirSync(pagesDir) // eslint-disable-line no-sync
	.filter(function (file) {
		return fs.statSync(// eslint-disable-line no-sync
			path.join(pagesDir, file)
		).isDirectory();
	});

const getPageWrapperTemplatePromise = readFile(pageWrapper)
	.then(text => _.template(text));

// Generate page tasks
pages.forEach(function (page) {
	const prefix = 'page:' + page,
			folder = path.join(pagesDir, page),
			reactFile = path.join(folder, `${page}.jsx`),
			pageBuildDir = page === 'index' ? buildDir : path.join(buildDir, page);


	gulp.task(`${prefix}:css`, function css() {
		return gulp.src(path.join(folder, `${page}.less`))
			.pipe(less())
			.pipe(rename('page.css'))
			.pipe(gulp.dest(pageBuildDir));
	});

	gulp.task(`${prefix}:build-page`, [`${prefix}:bundle`], function buildPage() {
		// this is an unfortunately weird way of handling the differences between common.js and imports;
		const Page = require(reactFile).default;
		return getPageWrapperTemplatePromise
			.then(template => template({
				title : `Project Explorer ${ Page.title ? '| ' + Page.title : ''}`,
				body  : ReactDOMServer.renderToString(React.createElement(Page))
			}))
			.then(contents => writeFile(path.join(pageBuildDir, 'index.html'), contents));
	});

	// change this so it's page specific
	gulp.task(`${prefix}:bundle`, ['bundle:shared'], function bundleRun() {
		const bundler = browserify([reactFile]).transform(babelify.configure({
			presets: ['es2015', 'react']
		}));

		// @todo I shouldn't have to do this... but for some reason
		// require('./pages/about/About.js'); does not work
		bundler.require([reactFile], {
			expose : '__jsx_page'
		});

		sharedLibs.forEach(function (lib) {
			bundler.external(lib);
		});

		return bundler.bundle()
			.on('error', err => handleError('uh oh issue while bundling shared libs!!!', err))
			.pipe(source('main.js'))
			.pipe(gulp.dest(pageBuildDir));
	});

});

gulp.task('build', function (cb) {
	runSequence('clean', 'minify', cb);
});

gulp.task('minify', ['bundle'], function minifyJavascript() {
	return gulp.src(['./build/**/*.js'])
			.pipe(rename({
				extname: '.min.js'
			}))
			.pipe(sourcemaps.init({
				loadMaps: true
			}))
			.pipe(uglify())
			.pipe(sourcemaps.write('./'))
			.pipe(gulp.dest(path.join(buildDir)));
});

gulp.task('bundle', pages.map(p => `page:${p}:build-page`).concat(
	pages.map(p =>`page:${p}:css`),
	'component:css'
));


const config = {
	coverage: {
		statements: 80,
		branches: 80,
		functions: 80,
		lines: 80
	},
	paths: {
		eslint: [
			'*.js',
			topLevelDirs + '/**/*.js'
		],
		eslintJSX: [
			'*.jsx',
			topLevelDirs + '/**/*.jsx'
		],
		js: [
			'*.js',
			topLevelDirs + '/**/*.js',
			'!**/*.test.js'
		],
		test: [
			'*.test.js',
			topLevelDirs + '/**/*.test.js'
		],
		whitespace: [
			'*.*',
			topLevelDirs + '/**/*.*',
			'!**/*.yaml'
		],
		packagejson: [
			'package.json'
		]
	}
};

function onError(e) {
	throw e;
}

function CheckCoverage() {
	function checkTypeCoverage(v, k) {
		return config.coverage[k] > v.pct;
	}

	const failedCoverage = _.some(istanbul.summarizeCoverage(),
		checkTypeCoverage);

	if (failedCoverage) {
		this.emit('error',
			new Error('Inadequate test coverage'));
	}
}

gulp.task('lint:whitespace', function lintWhitespace() {
	const notPackages = config.paths.packagejson.map(file => `!${file}`);

	return gulp.src(config.paths.whitespace.concat(notPackages))
		.pipe(lintspaces(lintspacesrc))
		.pipe(lintspaces.reporter())
		.on('error', onError);
});

gulp.task('lint:package', function lintWhitespace() {
	return gulp.src(config.paths.packagejson)
		.pipe(lintspaces(spacesindentrc))
		.pipe(lintspaces.reporter())
		.on('error', onError);
});

gulp.task('lint:js', function lintJS() {
	return gulp.src(config.paths.eslint)
		.pipe(
			gulpif(
				/\.test.js$/,
				eslint({
					envs : ['mocha'],
					configFile: eslintConfigFile
				}),
				eslint(eslintConfigFile)
			)
		)
		.pipe(eslint.format())
		.pipe(eslint.failAfterError())
		.on('error', onError);
});

gulp.task('lint:jsx', function lintJS() {
	return gulp.src(config.paths.eslintJSX)
		.pipe(eslint(eslintConfigFile))
		.pipe(eslint.format())
		.pipe(eslint.failAfterError())
		.on('error', onError);
});

gulp.task('mocha', function mochaRun(cb) {
	gulp.src(config.paths.js)
		.pipe(istanbul())
		.pipe(istanbul.hookRequire())
		.on('finish', function runTests() {
			gulp.src(config.paths.test)
				.pipe(babel())
				.pipe(mocha())
				.pipe(istanbul.writeReports())
				.on('end', CheckCoverage)
				.on('end', cb)
				.on('error', onError);
		});
});


gulp.task('lint', ['lint:whitespace', 'lint:package', 'lint:js', 'lint:jsx']);
gulp.task('test', ['lint', 'mocha']);
gulp.task('default', ['test']);

gulp.task('help', taskListing);
