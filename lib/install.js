'use strict';
const fs = require('fs');
const path = require('path');
const binBuild = require('bin-build');
const log = require('logalot');
const which = require('which');
const binVersionCheck = require('bin-version-check');
const {promisify} = require('util');

const bin = require('.');

const install = async () => {
	try {
		await bin.run();
		log.success('pngquant pre-build test passed successfully');
	} catch (err) {
		log.warn(err.message);
		log.warn('pngquant pre-build test failed');
		log.info('compiling from source');

		const libpng = process.platform === 'darwin' ? 'libpng' : 'libpng-dev';

		try {
			await binBuild.file(path.resolve(__dirname, '../vendor/source/pngquant.tar.gz'), [
				'rm ./INSTALL',
				`./configure --prefix="${bin.dest()}"`,
				`make install BINPREFIX="${bin.dest()}"`
			]);
			log.success('pngquant built successfully');
		} catch (err) {
			err.message = `pngquant failed to build, make sure that ${libpng} is installed`;
			log.error(err.stack);
			throw err;
		}
	}
};

(async () => {
	try {
		const use = process.platform === 'win32' ? 'pngquant.exe' : 'pngquant';
		const systemBin = await which(use).catch(error => {
			throw error;
		});
		const version = '>=2.0.0';
		await binVersionCheck(systemBin, version).catch(error => {
			log.warn(`The \`${systemBin}\` binary doesn't seem to work correctly or doesn't satisfy version \`${version}\``);
			throw error;
		});
		const target = path.join(__dirname, '../vendor', use);
		await promisify(fs.symlink)(systemBin, target).catch(error => {
			if (error.code === 'EEXIST') {
				return;
			}

			log.warn(error.message);
			throw error;
		});
		log.success(`create pngquant symlink \`${target}\``);
	} catch {
		await install().catch(() => {
			// eslint-disable-next-line unicorn/no-process-exit
			process.exit(1);
		});
	}
})();
