var program = require('commander');
var co = require('co');
var util = require('util');
var numeral = require('numeral');
var file = require('./lib/file');
var csv = require('./lib/csv');
var validator = require('./lib/validator');
var mapper = require('./lib/mapper');
var history = require('./lib/history');
var earnings = require('./lib/earnings');

//define the program

program
  .version('1.0.0')
  .option('-d, --data <dir>', 'CSV directory', file.existsSync)
  .option('-b, --bet <number>', 'Bet amount', parseFloat)
  .option('-p, --provider <string>', 'Odds provider')
  .option('-s, --streak <nunber>', 'Winning streak', parseInt)
  .option('-m, --maxOdds <number>', 'Max odds', parseFloat)
  .parse(process.argv);

//have we got arguments?

if (!process.argv.slice(2).length) {
  program.outputHelp();
  process.exit();
}

//let's go!

co(function* () {
  return yield csv.read(program);
})
.then(function(data) {
  return validator(data, program);
})
.then(function(data) {
  return mapper(data, program);
})
.then(function(data) {
  return history(data, program);
})
.then(function(data) {
  return earnings(data, program);
})
.then(function(data) {
  console.log(util.format('Bet £%s', program.bet));
  console.log(util.format('Odds from %s', program.provider));
  console.log(util.format('Winning streak %s', program.streak));
  console.log('--');
  console.log('Record');
  console.log(data.record);
  console.log('--');
  console.log('Cashflow');
  console.log(data.cashflow);
  console.log('--');
  console.log('Total bets %s' , data.bets);
  console.log('Total stake £%s' , numeral(data.stake).format('0,0.00'));
  console.log('--');
  console.log('Losses £%s', numeral(data.lost).format('0,0.00'));
  console.log('Winnings £%s' , numeral(data.won).format('0,0.00'));
  console.log('--');
  console.log('Net profit/loss £%s', numeral(data.won - data.lost).format('0,0.00'));
  console.log('Total profit/loss £%s', numeral(data.won - data.stake).format('0,0.00'));

  process.exit();
})
.catch(function(err) {
  console.log(err.stack);
});
