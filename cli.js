#!/usr/bin/env node
'use strict';

var help = require('help-version')(usage()).help,
    readmeToManPage = require('readme-to-man-page'),
    readmeFilenames = require('readme-filenames'),
    manPager = require('man-pager'),
    npmExpansion = require('npm-expansion'),
    findRoot = require('find-root');

var fs = require('fs'),
    path = require('path');


function usage () {
  return 'Usage:  readman [<module>]';
}


function error (err) {
  if (err) console.error(err.toString());
}


(function main (argv) {
  if (argv.length > 1) {
    return help(1);
  }

  var name = argv[0];
  var root;

  if (name) {
    try {
      root = rootForPackageName(name);
    }
    catch (err) {
      return error(err);
    }
  }
  else {
    try {
      root = findRoot(process.cwd());
    }
    catch (err) {
      root = process.cwd();
    }
  }

  readReadme(root, error);
}(process.argv.slice(2)));


function rootForPackageName (name) {
  // Clarify error message if package is missing.
  require.resolve(name);

  return path.dirname(require.resolve(path.join(name, 'package.json')));
}


function readReadme (root, cb) {
  var pkg;
  try {
    pkg = require(path.join(root, 'package.json'));
  }
  catch (err) {}

  fs.readdir(root, function (err, files) {
    if (err) return cb(err);

    var readmes = files.filter(function (filename) {
      return readmeFilenames.indexOf(filename) >= 0;
    });

    if (readmes.length != 1) {
      return error(Error('Readme not found.'));
    }

    displayReadme(pkg, path.join(root, readmes[0]), cb);
  });
}


function displayReadme (pkg, readmePath, cb) {
  fs.readFile(readmePath, 'utf8', function (err, readme) {
    if (err) return cb(err);

    var manPage = readmeToManPage(readme, pkg ? {
      name: pkg.name,
      version: pkg.version,
      description: pkg.description,
      section: 'npm',
      manual: npmExpansion()
    } : {
      name: path.basename(process.cwd())
    });

    manPager().end(manPage);
  });
}
