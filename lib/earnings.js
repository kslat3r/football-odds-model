var getFormWins = function(team, formResult) {
  if (formResult.homeTeam === team && formResult.homeTeamGoals > formResult.awayTeamGoals) {
    return true;
  }

  if (formResult.awayTeam === team && formResult.awayTeamGoals > formResult.homeTeamGoals) {
    return true;
  }

  return false;
};

var calculate = function(date, firstTeamGoals, secondTeamGoals, bet, odds, formWins, streak, maxOdds, out) {
  if (formWins.length === streak && (maxOdds === undefined || parseFloat(odds) < parseFloat(maxOdds))) {
    out.totalBets++;
    out.totalStake += parseFloat(bet);

    if (firstTeamGoals > secondTeamGoals) {
      out.record[date].wins.push((bet * odds));
    }
    else {
      out.record[date].losses.push(bet);
    }
  }

  return out;
};

module.exports = function(history, opts) {
  var results,
    out = {
      totalBets: 0,
      totalStake: 0,

      record: {},
      cashflow: [],

      totalLosses: 0,
      totalWinnings: 0
    };

  Object.keys(history).forEach(function(date) {
    results = history[date];

    out.record[date] = {
      wins: [],
      losses: []
    };

    results.forEach(function(result) {
      var homeTeamFormWins = result.homeTeamForm.filter(function(formResult) {
        return getFormWins(result.homeTeam, formResult);
      });

      var awayTeamFormWins = result.awayTeamForm.filter(function(formResult) {
        return getFormWins(result.awayTeam, formResult);
      });

      //let's do this

      out = calculate(result.date, result.homeTeamGoals, result.awayTeamGoals, opts.bet, result.homeTeamWinOdds, homeTeamFormWins, opts.streak, opts.maxOdds, out);
      out = calculate(result.date, result.awayTeamGoals, result.homeTeamGoals, opts.bet, result.awayTeamWinOdds, awayTeamFormWins, opts.streak, opts.maxOdds, out);
    });
  });

  //sort the recorded dates

  var recordedDates = Object.keys(out.record);
  recordedDates.sort(function(a, b) {
    var aParts = a.split('/');
    var bParts = b.split('/');

    return new Date(aParts[2], aParts[1] - 1, aParts[0]) - new Date(bParts[2], bParts[1] - 1, bParts[0]);
  });

  //get the data for each recorded date

  var sortedRecord = {};
  recordedDates.forEach(function(key) {
    sortedRecord[key] = out.record[key];
  });

  out.record = sortedRecord;

  //calculate

  Object.keys(out.record).forEach(function(date) {
    var results = out.record[date],
      wins = results.wins,
      losses = results.losses,
      cashflow = 0;

    wins.forEach(function(amount) {
      out.totalWinnings += amount;
      cashflow += amount;
    });

    losses.forEach(function(amount) {
      out.totalLosses += amount;
      cashflow -= amount;
    });

    out.cashflow[date] = cashflow;
  });

  return out;
};
