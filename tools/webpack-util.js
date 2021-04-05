/* eslint-disable no-multi-assign */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable func-names */
/* eslint-disable no-undef */

const path = require('path');
/* helper function to get into build directory */
module.exports = libPath = function (name) {
  if (undefined === name) {
    return path.join('dist');
  }

  return path.join('lib', name);
};
