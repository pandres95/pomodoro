#!/usr/bin/env node

'use strict';

const Worker = require('..');

if (process.env.NODE_ENV === 'develop') {
    const workDuration = 25;
    const breakDuration = 5;
    const longBreakDuration = 15;
    const iterations = 4;

    Worker({ workDuration, breakDuration, longBreakDuration, iterations });
} else {
    process.on('message', (args) => {
        console.log(args);
        Worker(args);
    });
}
