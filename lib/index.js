import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {BinWrapper} from '@mole-inc/bin-wrapper';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const url = 'https://raw.githubusercontent.com/mole-inc/pngquant-bin/v7.0.0/vendor/';

const bin = new BinWrapper()
	.src(`${url}macos/pngquant`, 'darwin')
	.src(`${url}linux/x86/pngquant`, 'linux', 'x86')
	.src(`${url}linux/x64/pngquant`, 'linux', 'x64')
	.src(`${url}freebsd/x64/pngquant`, 'freebsd', 'x64')
	.src(`${url}win/pngquant.exe`, 'win32')
	.dest(path.resolve(__dirname, '../vendor'))
	.use(process.platform === 'win32' ? 'pngquant.exe' : 'pngquant')
	.version('>=2.0.0');

export {bin};
export default bin.path;
