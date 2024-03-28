import Discord  from 'discord.js';

export default {
    name: 'unmute',
    description: 'Unmute a member in voice chat by mention',
    usage: '<@member>',
    run: async (client, message, args) => {
        if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.MuteMembers)) {
            return message.reply('You do not have permission to use this command.');
        }

        const target = message.mentions.members.first();
        if (!target) {
            return message.reply('Please mention a member to unmute.');
        }

        target.voice.setMute(false);
        message.reply(`${target.user.tag} has been unmuted.`);
    }
}