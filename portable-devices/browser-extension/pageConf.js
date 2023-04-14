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
    contentScript: {
        entry: path.resolve('src/contentScript'),
    },
    devtools: {
        entry: './src/devtools',
        template: './assets/html/panel.html',
    },
    newtab: {
        entry: './src/newtab',
        template: './assets/html/newtab.html',
    },
    panel: {
        entry: './src/panel',
        template: './assets/html/panel.html',
    },
};
