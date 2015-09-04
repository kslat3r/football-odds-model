var co = require('co');
var csv = require('./lib/csv');
var validator = require('./lib/validator');
var mapper = require('./lib/mapper');
var history = require('./lib/history');
var earnings = require('./lib/earnings');

//let's go!

module.exports = function* (opts) {
  return co(function* () {
    return yield csv.read(opts);
  })
  .then(function(data) {
    return validator(data, opts);
  })
  .then(function(data) {
    return mapper(data, opts);
  })
  .then(function(data) {
    return history(data, opts);
  })
  .then(function(data) {
    return earnings(data, opts);
  })
  .then(function(data) {
    return data;
  })
  .catch(function(err) {
    throw err;
  });
};
