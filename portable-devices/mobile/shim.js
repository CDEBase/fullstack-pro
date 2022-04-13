import 'text-encoding-polyfill'; // to fix App Crash due to reference to TextEncoder

if (typeof BigInt === 'undefined') global.BigInt = require('big-integer');