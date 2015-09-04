var csv = require('node-csv');
var q = require('q');
var _ = require('underscore');
var co = require('co');
var fs = require('fs');

module.exports = {
  read: function(opts) {
    if (opts.args.length === 0) {
      return this._readSingle(opts.data);
    }
    else {
      var files = opts.args;
      files.push(opts.data);

      return this._readMultiple(files);
    }
  },

  _readSingle: function(file) {
    var deferred = q.defer();

    csv.createParser().mapFile(file, function(err, data) {
      if (err) {
        deferred.reject(_.extend(err, {
          file: file
        }));
      }

      var out = {};
      out[file] = data;

      deferred.resolve(out);
    });

    return deferred.promise;
  },

  _readMultiple: function(files) {
    var deferred = q.defer(),
      filesMap = {},
      csvMap = {},
      i = 0,
      parser = csv.createParser();

    files.forEach(function(file) {
      i++;

      fs.readFile(file, 'utf-8', function(err, data) {
        if (err) {
          return deferred.reject(err);
        }

        filesMap[file.replace(/\.csv/, '').replace(/data\//, '')] = data;

        i--;
        if (i === 0) {
          Object.keys(filesMap).forEach(function(key) {
            i++;

            data = filesMap[key];

            parser.parse(data, function(err, obj) {
              if (err) {
                return deferred.reject(err);
              }

              parser.map(obj, function(err, mapped) {
                if (err) {
                  return deferred.reject(err);
                }

                csvMap[key] = mapped;

                i--;
                if (i === 0) {
                  return deferred.resolve(csvMap);
                }
              });
            });
          });
        }
      });
    });

    return deferred.promise;
  }
}
