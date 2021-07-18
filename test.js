import {fileURLToPath} from 'node:url';
import path from 'node:path';
import test from 'ava';
import execa from 'execa';
import tempy from 'tempy';
import binCheck from 'bin-check';
import compareSize from 'compare-size';
import pngquant from './lib/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
	t.true(await binCheck(pngquant, ['--version']));
});

test('minify a png', async t => {
	const temporary = tempy.directory();
	const src = path.join(__dirname, 'fixtures/test.png');
	const dest = path.join(temporary, 'test.png');
	const args = [
		'-o',
		dest,
		src,
	];

	await execa(pngquant, args);
	const result = await compareSize(src, dest);

	t.true(result[dest] < result[src]);
});
