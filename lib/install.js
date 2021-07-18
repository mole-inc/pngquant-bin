import {fileURLToPath} from 'node:url';
import {promises as fsPromises} from 'node:fs';
import path from 'node:path';
import binBuild from 'bin-build';
import log from 'consola';
import which from 'which';
import binVersionCheck from 'bin-version-check';
import {bin} from './index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const install = async () => {
	try {
		await bin.run();
		log.success('pngquant pre-build test passed successfully');
	} catch (error) {
		log.warn(error.message);
		log.warn('pngquant pre-build test failed');
		log.info('compiling from source');

		const libpng = process.platform === 'darwin' ? 'libpng' : 'libpng-dev';

		try {
			await binBuild.file(path.resolve(__dirname, '../vendor/source/pngquant.tar.gz'), [
				'rm ./INSTALL',
				`./configure --prefix="${bin.dest()}"`,
				`make install BINPREFIX="${bin.dest()}"`,
			]);
			log.success('pngquant built successfully');
		} catch (buildError) {
			buildError.message = `pngquant failed to build, make sure that ${libpng} is installed`;
			log.error(buildError.stack);
			throw buildError;
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
		await fsPromises.symlink(systemBin, target).catch(error => {
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
