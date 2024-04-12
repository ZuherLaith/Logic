import Discord from 'discord.js';
import { consoleLog, consoleWarn, consoleError } from '../../Struct/logger.js';
let isSendingMessage = false;

export default {
    name: 'dm',
    description: 'ارسال رسالة الى خاص الكل في السيرفر.',
    usage: '<message>',
    run: async (client, message, args) => {
        consoleLog(`Member [${message.member.displayName}] is using SendDM Command, (${message.content})`)
        // Check if the message author has permission to use this command
        if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
            return message.reply('**⛔ ليس لديك الصلاحيات لإستخدام هذا الأمر.**').then(msg => { setTimeout(() => msg.delete().catch(e=>{}), 6000) });
        }
        if (!args[0])
        {
            return message.reply('**⚠️ يجب كتابة رسالة محددة عند إستعمال الأمر.**').then(msg => { setTimeout(() => msg.delete().catch(e=>{}), 6000) });
        }

        // Check if the bot is currently sending a message
        if (isSendingMessage) {
            return message.reply('**⚠️ البوت يقوم بإرسال رسائل حاليا، يرجى الانتظار حتى الانتهاء.**').then(msg => { setTimeout(() => msg.delete().catch(e=>{}), 6000) });
        }

        // Set the flag to indicate that the bot is sending a message
        isSendingMessage = true;

        // Temporary message to notify the user that the bot is sending messages
        const tempMessage = await message.channel.send('**<a:image5:825489545768075274> جارٍ إرسال الرسائل...**');

        // Get the message content
        try {
            const guild = message.guild;
            const members = await guild.members.fetch();

            for (const member of members.values()) {
                if (member.user.bot || member.user.id === message.author.id) {
                    continue;
                }

                try {
                    await member.send(args.join(' '));
                    // Add a delay to avoid rate limiting
                    await new Promise(resolve => setTimeout(resolve, 500)); // 500 milliseconds (0.5 second) delay
                } catch (error) {
                    consoleError(`Failed to send message to ${member.user.tag}: ${error}`);
                }
            }
        } catch (error) {
            consoleError('Error sending message to everyone: ' + error);
        }

        // Reset the flag after completing the message sending process
        isSendingMessage = false;

        // Delete the temporary message
        tempMessage.delete().catch(error => consoleError('Failed to delete temporary message: ' + error));

        // Reply to the command user
        message.reply('**تم إرسال رسالتك الى الجميع بنجاح ✅**').then(msg => { setTimeout(() => msg.delete().catch(e=>{}), 6000) });
    }
}
