'use strict';

var requirePromise = require('./requirePromise');

var getPolyfill = require('./polyfill');
var define = require('define-properties');

/** @type {import('./shim')} */
module.exports = function shimAllKeyed() {
	requirePromise();

	var polyfill = getPolyfill();
	define(Promise, { allKeyed: polyfill }, {
		allKeyed: function testAllKeyed() {
			return Promise.allKeyed !== polyfill;
		}
	});
	return polyfill;
};
