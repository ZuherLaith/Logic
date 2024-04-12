import { config } from '../config.js';
import chalk from 'chalk';
import fs from 'node:fs';

if (config.logFile) {
  if (!fs.existsSync(config.logFile)) fs.writeFileSync(config.logFile, '');

  fs.writeFileSync(config.logFile, `[LOG] Logic-Bot log file created at ${new Date().toLocaleString()}\n\n\n`);
}

async function writeToLogFile(message, logType) {
  if (config.logFile) {
    if (typeof message === 'string') {
      message = message.replace(/\u001b\[\d+m/g, '');

      const data = fs.readFileSync(config.logFile, 'utf8');

      fs.writeFileSync(config.logFile, `${data}\n[${logType}] ${message}`);
    } else {
      console.error(`Invalid message passed to ${logType}:`, message);
    }
  }
}

export async function consoleLog(message) {
  console.log(`${chalk.bgWhiteBright('[LOG]')} ${chalk.cyanBright(message)}`);
  await writeToLogFile(message, 'LOG');
}

export async function consoleWarn(message) {
  console.warn(`${chalk.bgYellowBright('[WARN]')} ${chalk.yellowBright(message)}`);
  await writeToLogFile(message, 'WARN');
}

export async function consoleError(message) {
  console.error(`${chalk.bgRedBright('[ERROR]')} ${chalk.redBright(message)}`);
  await writeToLogFile(message, 'ERROR');
}

export async function consoleFL(message) {
  console.error(`${chalk.magenta(message)}`);
  await writeToLogFile(message, 'ERROR');
}
