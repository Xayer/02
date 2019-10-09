const assert = require('assert');
const RandExp = require('..');


// This is a simple "good enough" PRNG.
const initialSeed = Math.random() * Math.pow(2, 32) + Date.now();
function prng() {
	let seed = initialSeed;
	return function (a, b) {
		seed = Math.pow(seed, 2) % 94906249;
		return seed % (1 + b - a) + a;
	};
}

describe('Modify PRNG', () => {
	it('Should generate the same string with the same the PRNG seed', () => {
		const aRE = new RandExp(/.{100}/);
		aRE.randInt = prng();
		const a = aRE.gen();

		const bRE = new RandExp(/.{100}/);
		bRE.randInt = prng();
		const b = bRE.gen();

		const originalRandInt = RandExp.prototype.randInt;
		RandExp.prototype.randInt = prng();
		const c = RandExp.randexp(/.{100}/);
		RandExp.prototype.randInt = originalRandInt;

		const r = /.{100}/;
		r.randInt = prng();
		const d = RandExp.randexp(r);

		assert.equal(a, b, 'same seed should produce same output');
		assert.equal(a, c, 'same seed should produce same output');
		assert.equal(a, d, 'same seed should produce same output');
	});
});
