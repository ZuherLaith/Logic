import Discord from 'discord.js';

export default {
    name: 'mute',
    description: 'Mute a member in voice chat by mention with/without a period of time',
    usage: '<@member> [duration in seconds]',
    run: async (client, message, args) => {
        if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.MuteMembers)) {
            return message.reply('You do not have permission to use this command.');
        }

        const target = message.mentions.members.first();
        if (!target) {
            return message.reply('Please mention a member to mute.');
        }
        
        const duration = parseInt(args[1]);
        if (isNaN(duration)) {
            // Mute in text channels
            message.guild.channels.cache.filter(channel => channel.type === 'GUILD_TEXT').forEach(async channel => {
                await channel.permissionOverwrites.edit(target, {
                    SEND_MESSAGES: false
                });
            });

            // Mute in voice channel if member is connected
            if (target.voice.channel) {
                await target.voice.setMute(true);
            }

            return message.reply(`${target.user.tag} has been muted in all text channels.`);
        } else {
            // Mute for a specified duration
            message.guild.channels.cache.filter(channel => channel.type === 'GUILD_TEXT').forEach(async channel => {
                await channel.permissionOverwrites.edit(target, {
                    SEND_MESSAGES: false
                });
            });

            // Mute in voice channel if member is connected
            if (target.voice.channel) {
                await target.voice.setMute(true);
                message.reply(`${target.user.tag} has been muted for ${duration} seconds in all text channels.`);
                setTimeout(async () => {
                    await target.voice.setMute(false);
                    message.channel.send(`${target.user.tag} has been unmuted after ${duration} seconds in all text channels.`);
                }, duration * 1000);
            } else {
                return message.reply('Member is not in a voice channel.');
            }
        }
    }
}