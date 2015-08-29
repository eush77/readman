'use strict';

var readmeFilenames = require('readme-filenames');

var fs = require('fs'),
    path = require('path');


module.exports = function (name, cb) {
  try {
    require.resolve(name);
    var pkgPath = require.resolve(path.join(name, 'package.json'));
    var pkg = require(pkgPath);
    var root = path.dirname(pkgPath);
  }
  catch (err) {
    return cb(err);
  }

  fs.readdir(root, function (err, files) {
    if (err) return cb(err);

    var readmes = files.filter(function (filename) {
      return readmeFilenames.indexOf(filename) >= 0;
    });

    if (readmes.length != 1) {
      return cb(Error('Readme not found.'));
    }

    cb(null, pkg, path.join(root, readmes[0]));
  });
};
