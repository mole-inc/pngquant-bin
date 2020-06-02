# pngquant-bin ![Node CI](https://github.com/mole-inc/pngquant-bin/workflows/Node%20CI/badge.svg)

> [`pngquant`](https://github.com/kornelski/pngquant) is a PNG compressor that significantly reduces file sizes by converting images to a more efficient 8-bit PNG format

You probably want [`imagemin-pngquant`](https://github.com/mole-inc/imagemin-pngquant) instead.


[![Downloads](https://badgen.net/npm/dm/@mole-inc/pngquant-bin)](https://www.npmjs.com/package/@mole-inc/pngquant-bin)
[![Version](https://badgen.net/npm/v/@mole-inc/pngquant-bin)](https://www.npmjs.com/package/@mole-inc/pngquant-bin)

## Install

```
$ npm install @mole-inc/pngquant-bin
```


## Usage

```js
const execFile = require('child_process').execFile;
const pngquant = require('@mole-inc/pngquant-bin');

execFile(pngquant, ['-o', 'output.png', 'input.png'], err => {
	console.log('Image minified!');
});
```


## CLI

```
$ npm install --global @mole-inc/pngquant-bin
```

```
$ pngquant --help
```


## Updating pre-compiled binaries

The Linux binaries are statically linked so they should work on all Linux distributions. To recompile them:

1. `sudo apt-get install libpng-dev`
2. `./configure CFLAGS=-static && make && cp pngquant pngquant-64`
3. Repeat the above commands, but in a 32-bin docker container started with: docker run -ti -v `pwd`:/source i386/debian:9.3 bash


## License

This is a fork of [imagemin/pngquant-bin](https://github.com/imagemin/pngquant-bin) licensed under the GPL v3.

see license file.<br>
pngquant is licensed under the [GPL v3](https://raw.githubusercontent.com/kornelski/pngquant/master/COPYRIGHT).
