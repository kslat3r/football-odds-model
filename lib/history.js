var _ = require('underscore');
var form = require('./form');

module.exports = function(map, opts) {
  var formGuide = {},
    entry,
    alreadyPushed;

  Object.keys(map).forEach(function(seasonName) {
    Object.keys(map[seasonName]).forEach(function(teamName) {
      map[seasonName][teamName].forEach(function(result, i) {
        if (formGuide[result.date] === undefined) {
          formGuide[result.date] = [];
        }

        entry = _.extend(result, {
          homeTeamForm: form(map[seasonName], result.homeTeam, result.date, opts.streak),
          awayTeamForm: form(map[seasonName], result.awayTeam, result.date, opts.streak)
        });

        alreadyPushed = formGuide[result.date].some(function(existingEntry) {
          return existingEntry.homeTeam === entry.homeTeam && existingEntry.awayTeam === entry.awayTeam;
        });

        if (alreadyPushed === false) {
          formGuide[result.date].push(entry);
        }
      });
    });
  });

  return formGuide;
};
