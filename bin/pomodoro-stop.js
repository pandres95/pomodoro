#!/usr/bin/env node

'use strict';

const program = require('commander');
const { pid, dnd } = require('..');

program.parse(process.argv);

async function main () {
    try {
        await dnd.disable();
        await pid.kill();
    } catch (error) {
        if (error.code !== 'ESRCH') {
            console.error('There was an error trying to stop the process');
        }
    }
}

main();
