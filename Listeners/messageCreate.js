import { config } from '../config.js';
import { commands } from '../Struct/Client.js';
import Discord from 'discord.js';

export default {
    run: async (client, message) => {
        /////////////////////////////////////////////////////
        //                F U N C T I O N S                //
        function checkIfStringStartsWith(str, substrs) {
            return substrs.some(substr => str.startsWith(substr));
        }
        /////////////////////////////////////////////////////

        if (!message.content.startsWith(config.prefix) || message.author.bot || message.channel.type === "DM") return;
        // Remove every message in Commands channel:
        if (message.channel.id == config.DefaultCommandsChannel)
        { setTimeout(() => message.delete().catch(e=>{}), 750); }

        if (message.guild && message.guild.members) {
            config.EmbedColor = message.guild.members.me?.displayHexColor;
        }
        
        ///////////////////////////// Delete Messages with Links //////////////////////////////
        if (message.member && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {

            // Check if the message contains any links
            const containsLink = /(https?:\/\/[^\s]+)/gi.test(message.content);

            if (containsLink) {
                try {
                    // Delete the message
                    await message.delete();
                    // Optionally, you can send a warning message to the user
                    await message.author.send(`# ⛔ تم حذف رسالتك لإحتوائها على رابط خارجي:
                    \`${message.content}\``);
                } catch (error) {
                    console.error('Error deleting message:', error);
                }
            }
        }
        //////////////////////////////////////////////////////////////////////////////////////

        //          C O M M A N D S   H A N D L E R        //
        // Check if the message starts with the bot's prefix and is not sent by a bot
        if (!message.content.startsWith('طرد')) { if (message.channel.id !== config.DefaultCommandsChannel) { return; } }
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
            message.reply('There was an error executing this command.').then(msg => { setTimeout(() => msg.delete().catch(e=>{}), 6000) });
        }
        setTimeout(() => message.delete().catch(e=>{}), 750);
        return;
        }

        
    }
}