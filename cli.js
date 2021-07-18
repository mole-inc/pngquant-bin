#!/usr/bin/env node
import execa from 'execa';
import pngquant from './lib/index.js';

execa.sync(pngquant, process.argv.slice(2), {stdio: 'inherit'});
