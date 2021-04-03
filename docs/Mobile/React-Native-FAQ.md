
Q1. Uncaught TypeError: Cannot assign to read only property 'exports' of object '#<Object>'
A1. Because `import` and `module.exports` are not allowed to be mixed in webpack 2,
The solution is to change it to ES6.
