'use strict';

var $TypeError = require('es-errors/type');

/** @type {import('./requirePromise')} */
module.exports = function requirePromise() {
	if (typeof Promise !== 'function') {
		throw new $TypeError('`Promise.allKeyed` requires a global `Promise` be available.');
	}
};
