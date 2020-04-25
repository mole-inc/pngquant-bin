const path = require('path');
const test = require('ava');
const execa = require('execa');
const tempy = require('tempy');
const binCheck = require('bin-check');
const compareSize = require('compare-size');

const m = require('.');

/* Rebuild test
import fs from 'fs';
import binBuild from 'bin-build';
test('rebuild the pngquant binaries', async t => {
	const tmp = tempy.directory();

	await binBuild.file(path.resolve(__dirname, 'vendor/source/pngquant.tar.gz'), [
		'rm ./INSTALL',
		`./configure --prefix="${tmp}"`,
		`make install BINPREFIX="${tmp}"`
	]);

	t.true(fs.existsSync(path.join(tmp, 'pngquant')));
});
*/

test('verify binary', async t => {
	t.true(await binCheck(m, ['--version']));
});

test('minify a png', async t => {
	const temporary = tempy.directory();
	const src = path.join(__dirname, 'fixtures/test.png');
	const dest = path.join(temporary, 'test.png');
	const args = [
		'-o',
		dest,
		src
	];

	await execa(m, args);
	const result = await compareSize(src, dest);

	t.true(result[dest] < result[src]);
});
