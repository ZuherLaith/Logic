import { config } from '../config.js';
import { commands } from '../Struct/Client.js';

export default {
    run: async (client, message) => {
        console.log(message.content);
        /////////////////////////////////////////////////////
        //                F U N C T I O N S                //
        function checkIfStringStartsWith(str, substrs) {
            return substrs.some(substr => str.startsWith(substr));
        }
        /////////////////////////////////////////////////////

        //          C O M M A N D S   H A N D L E R        //
        // Check if the message starts with the bot's prefix and is not sent by a bot
        if (!message.content.startsWith(config.prefix) || message.author.bot) return;
        // Split the message content into command and arguments
        const args = message.content.slice(config.prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        // Check if the command exists
        const command = commands[commandName];
        if (command) {
        // Execute the command handler
        try {
            await command.run(client, message, args);
        } catch (error) {
            console.error('Error executing command:', error);
            message.reply('There was an error executing this command.');
        }
        return;
        }

        config.EmbedColor = message.guild.members.me.displayHexColor;
        if (message.author.bot || message.channel.type === "DM") return;

        
    }
}