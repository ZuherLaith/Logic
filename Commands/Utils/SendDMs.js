import Discord from 'discord.js';

export default {
    name: 'sendeveryone',
    description: 'Sends a message to everyone\'s DM in the server.',
    usage: '<message>',
    run: async (client, message, args) => {
        // Check if the message author has permission to use this command
        if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
            return message.reply('⛔ ليس لديك الصلاحيات لإستخدام هذا الأمر.');
        }

        // Get the message content
        try {
            const guild = message.guild;
            const members = await guild.members.fetch();

            members.forEach(async member => {
                if (member.user.bot || member.user.id === message.author.id) {
                    return;
                }

                try {
                    await member.send(args.join(' '));
                } catch (error) {
                    console.error(`Failed to send message to ${member.user.tag}: ${error}`);
                }
            });
        } catch (error) {
            console.error('Error sending message to everyone:', error);
        }

        // Reply to the command user
        message.reply('تم إرسال رسالتك الى الجميع بنجاح ✅');
    }
}
