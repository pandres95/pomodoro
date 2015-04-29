#!/usr/bin/env node
var fork = require('child_process').fork
,   path = require('path');

fork(path.join(__dirname, 'worker.js'));
