'use strict';

var requirePromise = require('./requirePromise');

var implementation = require('./implementation');

/** @type {import('./polyfill')} */
module.exports = function getPolyfill() {
	requirePromise();
	return typeof Promise.allKeyed === 'function' ? Promise.allKeyed : implementation;
};
