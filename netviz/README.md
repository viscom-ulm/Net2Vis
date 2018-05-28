# D3-STARTER

Basic setup for visualisations using D3.js

This project includes the following:

- [gulp](http://gulpjs.com) for building the project
- [D3.js](https://d3js.org) for creating the visualisation
- [jQuery](https://jquery.com) for other tasks like sending AJAX calls
- [browserify](http://browserify.org) to bundle your javascript
- A [eslint](http://eslint.org) config to lint your javascript
- A [SCSS/SASS compiler](https://github.com/dlmanning/gulp-sass) to compile SCSS/SASS into CSS

## Installation

Make sure you have [node.js](https://nodejs.org/en/) and [npm](https://www.npmjs.com) installed and working.
If you don't have `node` and `npm` installed, follow [this guide](https://nodejs.org/en/download/package-manager/).

After `node` and `npm` are installed, open a terminal, change into this project and run `npm install`.

## Building and Running

This project includes predefined tasks for building and running the project

- `npm start` starts a development server and live reloading when files are changed
- `npm build` rebuilds the whole project into the `dest` folder

If you just want to build the project, run `npm build` and put the files inside `dest` into a webserver of your choice.

For development, run `npm start` and start coding.
*Don't* use this development server in production!

## Project Structure

Take a look into `app` to see an minimal example application.
All files are compiled into the `dest` folder, so this folder contains the final application and it's content is therefore excluded from version control.
