const assert = require('assert');
const tests = require('./tests.js');
const RandExp = require('..');
const randexp = require('..').randexp;


const match = function (regexp, str, bad) {
	const err = `Generated string '${str}' ${
		bad ? 'matches' : 'does not match'} `
            + `regexp '${regexp.source}'`;
	const t = regexp.test(str);
	assert.ok(bad !== t, err);
};

function createIt(test) {
	return function () {
		let regs = test.regexp;
		if (!Array.isArray(regs)) { regs = [regs]; }

		for (let i = 0, l = regs.length; i < l; i++) {
			const reg = regs[i];
			const rand = new RandExp(reg);

			// Generate several times.
			for (let k = 0; k < 5; k++) {
				match(reg, rand.gen(), test.bad || false);
				match(reg, randexp(reg), test.bad || false);
			}
		}
	};
}

function createDescribe(test) {
	return function () {
		for (const row in test) {
			if (test.hasOwnProperty(row)) {
				const t = test[row];
				it(t.desc, createIt(t));
			}
		}
	};
}

for (const type in tests) {
	if (tests.hasOwnProperty(type)) {
		describe(type, createDescribe(tests[type]));
	}
}

describe('Call with a string', () => {
	it('Returns a correctly generated string', () => {
		const r = new RandExp('\d{4}');
		assert.equal(r.gen().length, 4);
	});

	describe('With options', () => {
		it('Detects options and sets them', () => {
			const r = new RandExp('hello', 'i');
			assert.ok(r.ignoreCase);
			assert.ok(!r.multiline);
		});
	});
});

describe('Call without a string or regular expression', () => {
	it('Throws an error', () => {
		assert.throws(() => {
			const r = new RandExp({});
			r.gen();
		}, /Expected a regexp or string/);
	});
});

describe('Followed by groups', () => {
	it('Generate nothing, for now', () => {
		assert.equal(randexp(/hi(?= no one)/), 'hi');
		assert.equal(randexp(/hi(?! no one)/), 'hi');
	});
});
