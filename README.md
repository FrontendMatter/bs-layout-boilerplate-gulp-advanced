# Bootstrap Layout advanced gulp boilerplate
Advanced Gulp boilerplate for [Bootstrap Layout](http://bootstrap-layout.themekit.io).

### Demo
> You can [see a working live demo](http://bs-layout-boilerplate-gulp-advanced.themekit.io) of this boilerplate.

### Features
* advanced [gulp](https://github.com/gulpjs/gulp) workflow
* compile Sass using [gulp-sass](https://github.com/dlmanning/gulp-sass) (gulp wrapper for [node-sass](https://github.com/sass/node-sass))
* import Sass files directly from node_modules using [sass-importer-npm](https://github.com/themekit/sass-importer-npm)
* watch Sass files for changes and recompile
* Minify CSS using [gulp-clean-css](https://github.com/scniro/gulp-clean-css) (gulp wrapper for [clean-css](https://github.com/jakubpawlowicz/clean-css))
* Automatically add CSS browser vendor prefixes to support the 2 most recent versions of all major browsers using [PostCSS](https://github.com/postcss/postcss) and [autoprefixer](https://github.com/postcss/autoprefixer)
* generate CSS sourcemaps using [gulp-sourcemaps](https://github.com/floridoo/gulp-sourcemaps) to enhance log messages when debugging
* leverage [browserify](https://github.com/substack/node-browserify) module system to bundle external vendor scripts and app scripts into a single JavaScript file
* watch JavaScript files for changes and recompile browserify bundles, using [watchify](https://github.com/substack/watchify) for fast incremental rebuilds
* generate sourcemaps for browserify bundles to enhance log messages when debugging
* clean dist assets before (re)builds using [del](https://github.com/sindresorhus/del)
* example of customizing colors

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