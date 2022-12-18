const path = require('path');

module.exports = {
  background: {
    entry: path.resolve('src/background'),
  },
  
  options: {
    entry: './src/options',
    template: './assets/html/options.html',
  },
  popup: {
    entry: './src/popup',
    template: './assets/html/popup.html',
  },
  contentScript:{
    entry: path.resolve('src/contentScript')
  }
};
