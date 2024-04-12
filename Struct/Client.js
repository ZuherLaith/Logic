import Discord from 'discord.js'
import { consoleLog, consoleWarn, consoleError } from './logger.js';

// ./ (Main Root)
import { config } from '../config.js';

//// TODO: New Handling way ////
import { promisify } from 'node:util';
import fs from 'node:fs';
import { join } from 'path';

const readdir = promisify(fs.readdir);
const commands = {};
const listenersObject = {};
////////////////////////////////

const client = new Discord.Client({
  partials: [
    Discord.Partials.Channel
  ],
  intents: [
    Discord.IntentsBitField.Flags.Guilds,
    Discord.IntentsBitField.Flags.GuildMembers,
    Discord.IntentsBitField.Flags.MessageContent,
    Discord.IntentsBitField.Flags.GuildMessages,
    Discord.IntentsBitField.Flags.GuildVoiceStates,
    Discord.IntentsBitField.Flags.GuildMessageReactions,
    Discord.IntentsBitField.Flags.GuildMessageTyping,
    Discord.IntentsBitField.Flags.DirectMessages,
    Discord.IntentsBitField.Flags.DirectMessageTyping,
    Discord.IntentsBitField.Flags.GuildEmojisAndStickers,
    Discord.IntentsBitField.Flags.GuildModeration
  ]
})


const prefix = config.prefix
const botId = config.botId
// const token = process.env.TOKEN;

/// Commands and Listeners ///
export async function loadCommands(commands) {
  try {
      // Read the directory ./Commands and its subdirectories
      const directories = await readdir('./Commands', { withFileTypes: true });
      for (const directory of directories) {
          if (directory.isDirectory()) {
              // Read command files in the current directory
              const commandsInDir = await readdir(join('./Commands', directory.name));
              for (const commandFile of commandsInDir) {
                  // Check if the file is a JavaScript file
                  if (commandFile.endsWith('.js')) {
                      // Dynamically import the command module
                      const commandModule = await import(`../Commands/${directory.name}/${commandFile}`);
                      // Extract the default export (assuming it's the command object)
                      const command = commandModule.default;
                      // Add the command to the provided object
                      commands[command.name] = command;
                  }
              }
          }
      }
      consoleLog('Commands loaded successfully.');
  } catch (error) {
      consoleError('Error loading commands:', error);
  }
}
async function loadListeners(directory = 'Listeners') {
  try {
    const files = await readdir(directory, { withFileTypes: true });
    for (const file of files) {
      if (file.isDirectory()) {
        await loadListeners(join(directory, file.name)); // Recursively load listeners in subdirectories
      } else if (file.isFile() && file.name.endsWith('.js')) {
        const listenerImport = await import(`../${join(directory, file.name)}`); // Adjusted import path

        const listenerName = file.name.split('.')[0];
        listenersObject[listenerName] = listenerImport.default;

        // Assuming listenersObject[listenerName].run is the function to be called
        client.on(listenerName, listenersObject[listenerName].run.bind(null, client));
      }
    }
    consoleLog('Listeners loaded successfully.');
  } catch (error) {
    consoleError('Error loading listeners:', error);
  }
}

loadCommands(commands);
loadListeners();

export function initializeClient(token) {
  client.once('ready', () => {
    // Finalizing bot starting and send a ready message into console:
    const currentDate = new Date();

    const day = currentDate.getDate().toString().padStart(2, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
    const year = currentDate.getFullYear();

    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const seconds = currentDate.getSeconds().toString().padStart(2, '0');

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = daysOfWeek[currentDate.getDay()];

    const fullDate = `${day}/${month}/${year}`;
    const fullTime = `${hours}:${minutes}:${seconds}`;
    const fullDay = `${dayOfWeek}`;

    consoleLog(`Started and Ready, Date: ${fullDate}, Time: ${fullTime}, Day: ${fullDay}, Year: ${year}`);
  });

  client.login(token);
}

export { commands };