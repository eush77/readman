#!/usr/bin/env node
'use strict';

var help = require('help-version')(usage()).help,
    readmeToManPage = require('readme-to-man-page'),
    readmeFilenames = require('readme-filenames'),
    manPager = require('man-pager'),
    npmExpansion = require('npm-expansion'),
    findRoot = require('find-root'),
    resolveFrom = require('resolve-from'),
    minimist = require('minimist'),
    rc = require('rc');

var fs = require('fs'),
    path = require('path');


function usage () {
  return 'Usage:  readman [--global | -g] [<module>]';
}


function error (err) {
  if (err) console.error(err.toString());
}


var opts = minimist(process.argv.slice(2), {
  boolean: ['global'],
  alias: {
    global: 'g'
  },
  unknown: function (arg) {
    if (arg[0] == '-') {
      return help(1);
    }
  }
});


(function main (opts, argv) {
  if (argv.length > 1) {
    return help(1);
  }

  var name = argv[0];
  var root;

  if (name) {
    try {
      root = rootForPackageName(name, opts.global);
    }
    catch (err) {
      return error(err);
    }
  }
  else {
    if (opts.global) {
      return error(Error('--global expects an explicit module name.'));
    }

    try {
      root = findRoot(process.cwd());
    }
    catch (err) {
      root = process.cwd();
    }
  }

  readReadme(root, error);
}(opts, opts._));


function rootForPackageName (name, global) {
  var basedir = (global
                 ? path.join((rc('npm', null, []).prefix
                              || path.resolve(process.execPath, '../..')),
                             'lib')
                 : process.cwd());
  var resolve = resolveFrom.bind(null, basedir);

  // Clarify error message if package is missing.
  resolve(name);

  return path.dirname(resolve(path.join(name, 'package.json')));
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
