import Discord from 'discord.js'

// ./ (Main Root)
import { config } from './config.js';

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
const token = config.token

// events.on('debug', console.log)

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
                      const commandModule = await import(`./Commands/${directory.name}/${commandFile}`);
                      // Extract the default export (assuming it's the command object)
                      const command = commandModule.default;
                      // Add the command to the provided object
                      commands[command.name] = command;
                  }
              }
          }
      }
      console.log('Commands loaded successfully.');
  } catch (error) {
      console.error('Error loading commands:', error);
  }
}
async function loadListeners(directory = './Listeners') {
  try {
    const files = await readdir(directory, { withFileTypes: true });
    for (const file of files) {
      if (file.isDirectory()) {
        await loadListeners(join(directory, file.name)); // Recursively load listeners in subdirectories
      } else if (file.isFile() && file.name.endsWith('.js')) {
        const listenerImport = await import(`./${join(directory, file.name)}`); // Adjusted import path

        const listenerName = file.name.split('.')[0];
        listenersObject[listenerName] = listenerImport.default;

        // Assuming listenersObject[listenerName].run is the function to be called
        client.on(listenerName, listenersObject[listenerName].run.bind(null, client));
      }
    }
    console.log('Listeners loaded successfully.');
  } catch (error) {
    console.error('Error loading listeners:', error);
  }
}


loadCommands(commands);
loadListeners();


client.once('ready', () => {
    console.log('Started and Ready.');
});

// client.on('raw', (data) => FastLink.other.handleRaw(data));
client.login(token);

export { commands };