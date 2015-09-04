var util = require('util');

module.exports = function(seasons, opts) {
  var season;

  Object.keys(seasons).forEach(function(key) {
    season = seasons[key];

    var providerValid = season.filter(function(result) {
      return result.hasOwnProperty(opts.provider + 'H')
        && result.hasOwnProperty(opts.provider + 'D')
        && result.hasOwnProperty(opts.provider + 'A');
    });

    if (providerValid.length !== season.length) {
      throw new Error(util.format('Provider %s was not present in all results for this data set %s', opts.provider, key));
    }
  });

  return seasons;
};
