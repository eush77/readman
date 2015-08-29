#!/usr/bin/env node
'use strict';

var help = require('help-version')(usage()).help,
    readmeFilenames = require('readme-filenames'),
    readmeToManPage = require('readme-to-man-page'),
    manPager = require('man-pager'),
    npmExpansion = require('npm-expansion');

var path = require('path'),
    fs = require('fs');


function usage () {
  return 'Usage:  readman [<module>]';
}


(function main (argv) {
  if (argv.length > 1) {
    return help(1);
  }

  var name = argv[0];

  if (name) {
    readmeForPackage(argv[0], function (err, readmePath) {
      if (err) throw err;

      fs.readFile(readmePath, 'utf8', function (err, readme) {
        if (err) throw err;

        var manPage = readmeToManPage(readme, {
          name: name,
          section: 'npm',
          manual: npmExpansion()
        });

        manPager().end(manPage);
      });
    });
  }
}(process.argv.slice(2)));


function readmeForPackage (name, cb) {
  var root = path.dirname(require.resolve(path.join(name, 'package.json')));

  fs.readdir(root, function (err, files) {
    if (err) return cb(err);

    var readmes = files.filter(function (filename) {
      return readmeFilenames.indexOf(filename) >= 0;
    });

    if (readmes.length != 1) {
      return cb(Error('Readme not found.'));
    }

    cb(null, path.join(root, readmes[0]));
  });
}
