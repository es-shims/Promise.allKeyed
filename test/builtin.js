'use strict';

var defineProperties = require('define-properties');
var isEnumerable = Object.prototype.propertyIsEnumerable;
var functionsHaveNames = require('functions-have-names')();
var callBind = require('call-bind');

var runTests = require('./tests');

module.exports = function (t) {
	t.equal(Promise.allKeyed.length, 1, 'Promise.allKeyed has a length of 1');

	t.test('Function name', { skip: !functionsHaveNames }, function (st) {
		st.equal(Promise.allKeyed.name, 'allKeyed', 'Promise.allKeyed has name "allKeyed"');

		st.end();
	});

	t.test('enumerability', { skip: !defineProperties.supportsDescriptors }, function (et) {
		et.equal(false, isEnumerable.call(Promise, 'allKeyed'), 'Promise.allKeyed is not enumerable');

		et.end();
	});

	var supportsStrictMode = (function () { return typeof this === 'undefined'; }());

	t.test('bad object value', { skip: !supportsStrictMode }, function (st) {
		st['throws'](function () { return Promise.allKeyed.call(null, {}); }, TypeError, 'null is not a constructor');

		st.end();
	});

	var bound = callBind.apply(Promise.allKeyed);
	var rebindable = function allKeyed(promises) { // eslint-disable-line no-unused-vars
		return bound(typeof this === 'undefined' ? Promise : this, arguments);
	};

	runTests(rebindable, t);
};
