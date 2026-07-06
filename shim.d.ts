import implementation = require('./implementation');

/**
 * Installs the `Promise.allKeyed` polyfill onto the global `Promise` if needed, and returns the resulting implementation.
 */
declare function shimAllKeyed(): typeof implementation;

export = shimAllKeyed;
