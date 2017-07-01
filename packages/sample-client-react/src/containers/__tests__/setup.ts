/* setup.js */

let jsdom = require('jsdom').jsdom;

let exposedProperties = ['window', 'navigator', 'document'];

(<any>global).document = jsdom('');
(<any>global).window = document.defaultView;
Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
  }
});

(<any>global).navigator = {
  userAgent: 'node.js',
};
