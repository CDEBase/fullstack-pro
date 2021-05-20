/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const _require = require('esm')(module);

process.once('loaded', () => {
    global.require = _require;
});
