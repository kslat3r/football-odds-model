var _ = require('underscore');

module.exports = function(season, teamName, date, streak) {
  var out = [];
  var fixtures = season[teamName];

  var index = fixtures.findIndex(function(fixture) {
    return fixture.date === date;
  });

  var iterator = streak;

  while (iterator > 0) {
    if (fixtures[index - iterator] !== undefined) {
      var clone = _.clone(fixtures[index - iterator]);
      delete clone.homeTeamForm;
      delete clone.awayTeamForm;

      out.push(clone);
    }

    iterator--;
  }

  return out.reverse();
};
