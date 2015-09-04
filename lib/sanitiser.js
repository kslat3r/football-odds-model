module.exports = function(teamName) {
  teamName = teamName.replace(/Middlesboro/, 'Middlesbrough');
  teamName = teamName.replace(/Nott\'m Forest/, 'Nottingham Forest');

  return teamName;
};
