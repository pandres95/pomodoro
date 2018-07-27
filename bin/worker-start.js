#!/usr/bin/env node

'use strict';

const Notifier  = require('node-notifier');
const { join } = require('path');
const Promisify = require('es-promisify');
const Chalk = require('chalk');
const doNotDisturb = require('@sindresorhus/do-not-disturb');

const notify = Promisify(Notifier.notify, Notifier);

const program = require('commander');

program
    .option('-w --work-duration <value>',
        'Set the duration a pomodoro slot should last. Defaults to 25 minutes',
        25)
    .option('-b --break-duration <value>',
        'Set the duration to take on each break slot. Defaults to 5 minutes', 5)
    .option('-B --long-break-duration <value>',
        'Set the rest time to take every <i> pomodoros. Defaults to 15 minutes',
        15)
    .option('-i --iterations <value>',
        'Set the number of pomodoros before a long break. Defaults to 4',
        4)
    .parse(process.argv);

async function sendNotification (user, action, time, sound = true, wait = true) {
    try {
        const icon = join(__dirname, '..', 'img', action === 'work'
            ? 'go.png'
            : 'stop.png');

        const title = `Hi, ${user}`;
        const message =
            `It's time to ${action}, your next change is in ${time} minutes`;

        await notify({ title, message, icon, sound, wait });
    } catch (error) { }
}

function runSlots (user, w, b, i) {
    console.warn(Chalk`{bgWhite.yellow.bold ${i} iterations should be run}`);
    return new Promise(async (resolve, reject) => {
        let iterations = 1;
        let slotTask;

        const slotAction = async () => {
            iterations += 1;

            if (iterations < i) {
                runBreak(user, w, b);
            }

            if (iterations <= (i + 1)) {
                console.log(Chalk`{bgWhite.blue.bold SLOT ${iterations - 1} ticked at ${Date()}}`);
                await sendNotification(user, 'work', w);
                console.log('dnd on');
                await doNotDisturb.enable();
            }

            if (iterations === (i + 1)) {
                clearInterval(slotTask);
                slotTask = setInterval(async () => {
                    await slotAction();
                }, ((60000 * w) - 5000));
            } else if (iterations > (i + 1)) {
                clearInterval(slotTask);
                console.log(Chalk`{bgWhite.red.bold Slots destroyed at ${Date()}}`);
                return resolve();
            }
        };

        slotTask = setInterval(async () => {
            await slotAction();
        }, 60000 * (w + b));

        console.log(Chalk`{bgWhite.green.bold Slots started at ${Date()}}`);
        await slotAction();
    });
}

function runBreak (user, t, b) {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            console.log(Chalk`{bgWhite.green.bold Break ticked at ${Date()}}`);
            console.log('dnd off');
            await doNotDisturb.disable();
            await sendNotification(user, 'break', b);
            resolve();
        }, 60000 * t);

        console.log(`Break (${b} minutes in ${t} minutes) scheduled at ${Date()}`);
    });
}

async function runPomodoro (user, w, b, lB, i) {
    console.log(`Main sequence ticked at ${Date()}`);
    console.log('Pre-running pomodoro');
    await runSlots(user, w, b, i);
    console.log(Chalk`{bgWhite.yellow.bold Long break ticked at ${Date()}}`);
    console.log('dnd off');
    await doNotDisturb.disable();
    await sendNotification(user, 'long break', lB);
    console.log(`Main sequence ended at ${Date()}`);
}

function main ({ workDuration, breakDuration, longBreakDuration, iterations }) {
    console.log(workDuration, breakDuration, longBreakDuration, iterations);
    const timing = (iterations * workDuration) +
        ((iterations - 1) * breakDuration) + longBreakDuration;
    setInterval(() =>
        runPomodoro(process.env.USER, workDuration, breakDuration,
            longBreakDuration, iterations),
    60000 * timing);

    console.log(`Main sequence (${timing} minutes) scheduled at ${Date()}`);
    runPomodoro(process.env.USER, workDuration, breakDuration,
        longBreakDuration, iterations);
}

main(program);
