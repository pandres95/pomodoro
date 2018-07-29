#!/usr/bin/env node

'use strict';

const program = require('commander');
const { fork } = require('child_process');
const { resolve } = require('path');
const { pid } = require('..');

program
    .option('-w --work-duration <value>',
        'Set the duration a pomodoro slot should last. Defaults to 25 minutes',
        25)
    .option('-b --break-duration <value>',
        'Set the duration to take on each break slot. Defaults to 5 minutes',
        5)
    .option('-B --long-break-duration <value>',
        'Set the rest time to take every <i> pomodoros. Defaults to 15 minutes',
        15)
    .option('-i --iterations <value>',
        'Set the number of pomodoros before a long break. Defaults to 4',
        4)
    .parse(process.argv);

async function main () {
    try {
        try { await pid.kill(); } catch (_) {}

        const path = resolve(__dirname, 'pomodoro-start-worker.js');
        const child = fork(path, [], {
            cwd: process.cwd(),
            detached: true,
            silent: true,
            stdout: process.stdout,
            stderr: process.stderr
        });

        await pid.set(child.pid);

        child.send(program);

        child.unref();
        process.exit();
    } catch (error) {
        console.error('There was an error trying to save the process PID');
        console.error(error);
    }
}

main();
