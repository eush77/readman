#!/usr/bin/env node
'use strict';

var readmeForPackage = require('./lib/readme-for-package');

var help = require('help-version')(usage()).help,
    readmeToManPage = require('readme-to-man-page'),
    manPager = require('man-pager'),
    npmExpansion = require('npm-expansion');

var fs = require('fs');


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
      if (err) return error(err);

      fs.readFile(readmePath, 'utf8', function (err, readme) {
        if (err) return error(err);

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


function error (err) {
  console.error(err.toString());
}
