var co = require('co');
var file = require('./lib/file');
var csv = require('./lib/csv');
var validator = require('./lib/validator');
var mapper = require('./lib/mapper');
var history = require('./lib/history');
var earnings = require('./lib/earnings');

//let's go!

module.exports = {
  getProviders: function* () {
    try {
      var providers = [];
      var seasons = yield this.getSeasons();

      var files = seasons.map(function(file) {
        return './data/' + file + '.csv';
      });

      var fileData = yield csv.read({
        args: files
      });

      Object.keys(fileData).forEach(function(league) {
        Object.keys(fileData[league][0]).forEach(function(key) {
          if (key.indexOf('D') === key.length - 1 && key.indexOf('Bb') === -1) {
            var provider = key.replace(/D/, '');

            if (providers.indexOf(provider) === -1) {
              providers.push(provider);
            }
          }
        });
      });

      return providers;
    }
    catch (e) {
      throw e;
    }
  },

  getSeasons: function* () {
    try {
      var files = yield file.readDir('./data');

      return files.map(function(file) {
        return file.replace(/.csv/, '');
      });
    }
    catch (e) {
      throw e;
    }
  },

  run: function* (opts) {
    try {
      opts.args = opts.seasons.map(function(season) {
        return './data/' + season + '.csv';
      });

      var out = yield csv.read(opts);
      out = validator(out, opts);
      out = mapper(out, opts);
      out = history(out, opts);
      out = earnings(out, opts);

      return out;
    }
    catch (e) {
      throw (e);
    }
  }
};

co(function* () {
  var seasons = yield module.exports.getSeasons(),
    season = seasons[0];

  var results = yield module.exports.run({
    seasons: [season],
    provider: 'WH',
    bet: 10,
    streak: 2,
    maxOdds: 2
  });

  console.log(results);
})
.catch(function(e) {
  console.log(e);
  console.log(e.stack);
});

