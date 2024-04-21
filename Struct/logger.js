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
  console.log(`\u001b[46m[LOG]\u001b[0m \u001b[36m${(message)}\u001b[0m`);
  await writeToLogFile(message, 'LOG');
}

export async function consoleWarn(message) {
  console.warn(`\u001b[43m[WARN]\u001b[0m \u001b[33m${(message)}\u001b[0m`);
  await writeToLogFile(message, 'WARN');
}

export async function consoleError(message) {
  console.error(`\u001b[41m[ERROR]\u001b[0m \u001b[31m${(message)}\u001b[0m`);
  await writeToLogFile(message, 'ERROR');
}

export async function consoleFL(message) {
  console.error(`\u001b[35m${(message)}\u001b[0m`);
  await writeToLogFile(message, 'ERROR');
}
