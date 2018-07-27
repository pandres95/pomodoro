#!/usr/bin/env node

'use strict';

require('daemon')({ cwd: __dirname });
require('./worker.js');
