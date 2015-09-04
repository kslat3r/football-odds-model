var fs = require('fs');
var util = require('util');

module.exports = {
  existsSync: function(value) {
    if (value.indexOf('*') !== -1) {
      return value;
    }

    if (fs.existsSync(value) === false) {
      throw new Error(util.format('File does not exist %s', value));
    }

    return value;
  }
};
