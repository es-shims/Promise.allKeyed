# promise.allkeyed <sup>[![Version Badge][npm-version-svg]][package-url]</sup>

[![github actions][actions-image]][actions-url]
[![coverage][codecov-image]][codecov-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

[![npm badge][npm-badge-png]][package-url]

ES Proposal spec-compliant shim for `Promise.allKeyed`. Invoke its "shim" method to shim `Promise.allKeyed` if it is unavailable or noncompliant. **Note**: a global `Promise` must already exist: the [es6-shim](https://github.com/es-shims/es6-shim) is recommended.

This package implements the [es-shim API](https://github.com/es-shims/api) interface. It works in an ES3-supported environment that has `Promise` available globally, and complies with the [proposed spec](https://tc39.es/proposal-await-dictionary/).

`Promise.allKeyed` is like `Promise.all`, but for a dictionary (a plain object) rather than an iterable: it awaits every enumerable own property value, and fulfills with a `null`-prototype object of the same keys mapped to their resolved values. As with `Promise.all`, it rejects as soon as any input rejects.

Most common usage:
```js
var assert = require('assert');
var allKeyed = require('promise.allkeyed');

allKeyed({
	shape: Promise.resolve('square'),
	color: 'blue',
	mass: Promise.resolve(42)
}).then(function (results) {
	assert.equal(results.shape, 'square');
	assert.equal(results.color, 'blue');
	assert.equal(results.mass, 42);
});

require('promise.allkeyed/shim')(); // will be a no-op if not needed

Promise.allKeyed({
	a: Promise.resolve(1),
	b: 2
}).then(function (results) {
	assert.equal(results.a, 1);
	assert.equal(results.b, 2);
});
```

The `polyfill`, `implementation`, and `shim` methods are available as separate entry points, per the [es-shim API](https://github.com/es-shims/api):
```js
var getPolyfill = require('promise.allkeyed/polyfill');
var implementation = require('promise.allkeyed/implementation');
var shim = require('promise.allkeyed/shim');
```

## Tests
Simply clone the repo, `npm install`, and run `npm test`

[package-url]: https://npmjs.com/package/promise.allkeyed
[npm-version-svg]: https://versionbadg.es/es-shims/Promise.allKeyed.svg
[deps-svg]: https://david-dm.org/es-shims/Promise.allKeyed.svg
[deps-url]: https://david-dm.org/es-shims/Promise.allKeyed
[dev-deps-svg]: https://david-dm.org/es-shims/Promise.allKeyed/dev-status.svg
[dev-deps-url]: https://david-dm.org/es-shims/Promise.allKeyed#info=devDependencies
[npm-badge-png]: https://nodei.co/npm/promise.allkeyed.png?downloads=true&stars=true
[license-image]: https://img.shields.io/npm/l/promise.allkeyed.svg
[license-url]: LICENSE
[downloads-image]: https://img.shields.io/npm/dm/promise.allkeyed.svg
[downloads-url]: https://npm-stat.com/charts.html?package=promise.allkeyed
[codecov-image]: https://codecov.io/gh/es-shims/Promise.allKeyed/branch/main/graphs/badge.svg
[codecov-url]: https://app.codecov.io/gh/es-shims/Promise.allKeyed/
[actions-image]: https://img.shields.io/github/check-runs/es-shims/Promise.allKeyed/main
[actions-url]: https://github.com/es-shims/Promise.allKeyed/actions
