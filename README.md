# Bootstrap Layout Gulp Boilerplate
Advanced Gulp boilerplate for [Bootstrap Layout](http://bootstrap-layout.themekit.io).

### Demo
> You can [see a working live demo](http://bs-layout-boilerplate-gulp-advanced.themekit.io) of this boilerplate.

### Features
* advanced gulp workflow
* compile Sass using gulp-sass (gulp wrapper for node-sass)
* import Sass files directly from node_modules using sass-importer-npm
* watch Sass files for changes and recompile
* Minify CSS using gulp-clean-css (gulp wrapper for clean-css)
* Automatically add CSS browser vendor prefixes to support the 2 most recent versions of all major browsers using PostCSS and autoprefixer
* generate CSS sourcemaps to enhance log messages when debugging
* leverage browserify module system to bundle external vendor scripts and app scripts into a single JavaScript file
* watch JavaScript files for changes and recompile browserify bundles, using watchify for fast incremental rebuilds
* generate sourcemaps for browserify bundles to enhance log messages when debugging
* clean dist assets before (re)builds using del
* example of customizing AdminPlus Lite colors

### Usage
#### Clone the boilerplate repository
```bash
git clone https://github.com/themekit/bs-layout-boilerplate-gulp-advanced.git my-project
```
```bash
cd my-project
```
#### Install dependencies
```
npm install
```
#### Build
```
gulp
```
#### Watch
```
gulp watch
```

### Libraries
- [gulp](https://github.com/gulpjs/gulp)
- [gulp-sass](https://github.com/dlmanning/gulp-sass) (gulp wrapper for [node-sass](https://github.com/sass/node-sass))
- [sass-importer-npm](https://github.com/themekit/sass-importer-npm)
- [gulp-clean-css](https://github.com/scniro/gulp-clean-css) (gulp wrapper for [clean-css](https://github.com/jakubpawlowicz/clean-css))
- [PostCSS](https://github.com/postcss/postcss) and [autoprefixer](https://github.com/postcss/autoprefixer)
- [gulp-sourcemaps](https://github.com/floridoo/gulp-sourcemaps)
- [browserify](https://github.com/substack/node-browserify) and [watchify](https://github.com/substack/watchify)
- [del](https://github.com/sindresorhus/del)
- [adminplus](https://github.com/themekit/bootstrap-layout)