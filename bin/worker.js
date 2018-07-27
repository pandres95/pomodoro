#!/usr/bin/env node

'use strict';

const { version } = require('../package');
const program = require('commander');

program
    .version(version)
    .description([
        'Get to work. Use this CLI tool to make your pomodoros work.',
        [
            'Pomodoro lets you customize a set of reminders to appropiately',
            'use the technique your own style. Also (on MacOS) it enables the',
            'DND mode, so nothing disturbs you.'
        ].join(' ')
    ].join('\n\n  '))
    .command('stop', 'stops the application')
    .command('start', 'starts the pomodoro process')
    .parse(process.argv);
