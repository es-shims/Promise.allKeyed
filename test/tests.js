'use strict';

var forEach = require('for-each');
var inspect = require('object-inspect');

var getProto = Object.getPrototypeOf;
var hasOwn = Object.prototype.hasOwnProperty;
var hasSymbols = typeof Symbol === 'function' && typeof Symbol('foo') === 'symbol';

var makeClass = function (source) {
	try {
		// eslint-disable-next-line no-new-func
		return Function('return (' + source + ');')();
	} catch (e) {
		return false;
	}
};

module.exports = function runTests(allKeyed, t) {
	if (typeof Promise !== 'function') {
		return t.skip('No global Promise detected');
	}

	t.test('non-object input rejects with a TypeError', function (st) {
		var cases = [undefined, null, true, false, 42, 'foo'];
		st.plan(cases.length);

		forEach(cases, function (nonObject) {
			allKeyed(nonObject).then(function () {
				st.fail(inspect(nonObject) + ': should not fulfill');
			}, function (e) {
				st.equal(e instanceof TypeError, true, inspect(nonObject) + ': rejects with a TypeError');
			});
		});
	});

	t.test('resolves a dictionary of values and promises', function (st) {
		st.plan(4);

		allKeyed({
			a: 1,
			b: Promise.resolve(2),
			c: 'three'
		}).then(function (result) {
			st.deepEqual(
				{ a: result.a, b: result.b, c: result.c },
				{ a: 1, b: 2, c: 'three' },
				'each value is resolved under its key'
			);
			st.equal(getProto(result), null, 'result object has a null prototype');
			st.deepEqual(Object.keys(result), ['a', 'b', 'c'], 'result has the same own keys, in order');
			st.equal(hasOwn.call(result, 'a'), true, 'keys are own data properties');
		}, st.fail);
	});

	t.test('result key order follows the input keys, not settlement timing', function (st) {
		st.plan(2);

		var deferredFirst = Promise.resolve().then(function () {}).then(function () {}).then(function () { return 'first'; });

		allKeyed({ a: deferredFirst, b: Promise.resolve('b'), c: 'c' }).then(function (result) {
			st.deepEqual(Object.keys(result), ['a', 'b', 'c'], 'keys stay in input order even though `a` settles last');
			st.equal(result.a, 'first', 'the late-settling value is still placed under its key');
		}, st.fail);
	});

	t.test('an empty dictionary resolves to an empty null-proto object', function (st) {
		st.plan(2);

		allKeyed({}).then(function (result) {
			st.equal(getProto(result), null, 'result object has a null prototype');
			st.deepEqual(Object.keys(result), [], 'result has no own keys');
		}, st.fail);
	});

	t.test('only enumerable own properties are awaited', function (st) {
		st.plan(1);

		var obj = { visible: Promise.resolve('yes') };
		Object.defineProperty(obj, 'hidden', { enumerable: false, value: Promise.resolve('no') });

		var withInherited = Object.create({ inherited: Promise.resolve('nope') });
		withInherited.own = Promise.resolve('own');

		Promise.all([allKeyed(obj), allKeyed(withInherited)]).then(function (results) {
			st.deepEqual(
				[Object.keys(results[0]), Object.keys(results[1])],
				[['visible'], ['own']],
				'non-enumerable and inherited keys are excluded'
			);
		}, st.fail);
	});

	t.test('symbol keys are awaited', { skip: !hasSymbols }, function (st) {
		st.plan(3);

		var sym = Symbol('sym');
		var obj = {};
		obj[sym] = Promise.resolve('symbol value');
		obj.str = Promise.resolve('string value');

		allKeyed(obj).then(function (result) {
			st.equal(result[sym], 'symbol value', 'symbol-keyed value is resolved');
			st.equal(result.str, 'string value', 'string-keyed value is resolved');
			st.equal(getProto(result), null, 'result object has a null prototype');
		}, st.fail);
	});

	t.test('rejects with the first rejection reason', function (st) {
		st.plan(1);

		var sentinel = { sentinel: true };

		allKeyed({
			a: Promise.resolve(1),
			b: Promise.reject(sentinel),
			c: Promise.resolve(3)
		}).then(st.fail, function (e) {
			st.equal(e, sentinel, 'rejects with the reason of the first-rejecting input');
		});
	});

	t.test('rejects if reading a property value throws', function (st) {
		st.plan(1);

		var err = new Error('getter threw');
		var obj = {};
		Object.defineProperty(obj, 'bad', { enumerable: true, get: function () { throw err; } });

		allKeyed(obj).then(st.fail, function (e) {
			st.equal(e, err, 'rejects with the thrown error');
		});
	});

	t.test('rejects if a value is a thenable with a poisoned `then`', function (st) {
		st.plan(1);

		var err = new Error('poisoned then');
		var thenable = {};
		Object.defineProperty(thenable, 'then', { get: function () { throw err; } });

		allKeyed({ a: thenable }).then(st.fail, function (e) {
			st.equal(e, err, 'rejects with the error thrown when adopting the thenable');
		});
	});

	var Subclass = makeClass('class Subclass extends Promise {}');

	t.test('preserves the subclass', { skip: !Subclass }, function (st) {
		st.plan(2);

		var promise = allKeyed.call(Subclass, { a: Subclass.resolve(1) });
		st.equal(promise instanceof Subclass, true, 'result promise is an instance of the subclass');

		promise.then(function (result) {
			st.equal(result.a, 1, 'the subclass-wrapped value is resolved');
		}, st.fail);
	});

	var BadResolve = makeClass('class BadResolve extends Promise { static get resolve() { return undefined; } }');

	t.test('rejects if the constructor `resolve` is not callable', { skip: !BadResolve }, function (st) {
		st.plan(1);

		allKeyed.call(BadResolve, {}).then(st.fail, function (e) {
			st.equal(e instanceof TypeError, true, 'rejects with a TypeError');
		});
	});

	var DoubleThen = makeClass('class DoubleThen extends Promise { static resolve(v) { return { then: function (onFulfilled) { onFulfilled(v); onFulfilled("ignored"); } }; } }');

	t.test('a resolve element is only honored once', { skip: !DoubleThen }, function (st) {
		st.plan(2);

		allKeyed.call(DoubleThen, { a: 1 }).then(function (result) {
			st.equal(result.a, 1, 'only the first fulfillment value is used');
			st.equal(getProto(result), null, 'result object has a null prototype');
		}, st.fail);
	});

	return t.comment('tests completed');
};
