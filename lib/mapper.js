var _ = require('underscore');
var sanitiser = require('./sanitiser');

module.exports = function(seasons, opts) {
  var map = {},
    homeTeam,
    awayTeam,
    season;

  Object.keys(seasons).forEach(function(seasonName) {
    season = seasons[seasonName];

    season.forEach(function(result) {
      if (map[seasonName] === undefined) {
        map[seasonName] = {};
      }

      homeTeam = sanitiser(result.HomeTeam);
      awayTeam = sanitiser(result.AwayTeam);

      if (map[seasonName][homeTeam] === undefined) {
        map[seasonName][homeTeam] = [];
      }

      if (map[seasonName][awayTeam] === undefined) {
        map[seasonName][awayTeam] = [];
      }

      var obj = {
        date: result.Date,
        homeTeam: homeTeam,
        awayTeam: awayTeam,
        homeTeamGoals: result.FTHG,
        awayTeamGoals: result.FTAG,
        homeTeamWinOdds: result[opts.provider + 'H'],
        awayTeamWinOdds: result[opts.provider + 'A']
      };

      map[seasonName][homeTeam].push(obj);
      map[seasonName][awayTeam].push(_.clone(obj));
    });
  });

  return map;
};
