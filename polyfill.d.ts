import implementation = require('./implementation');

/**
 * Returns the native `Promise.allKeyed` if it is present and compliant, otherwise the custom implementation.
 */
declare function getPolyfill(): typeof implementation;

export = getPolyfill;
