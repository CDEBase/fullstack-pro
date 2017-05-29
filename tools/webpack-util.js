var path = require('path');
/* helper function to get into build directory */
module.exports = libPath = function (name) {
  if (undefined === name) {
    return path.join('dist');
  }

  return path.join('lib', name);
};
