import { Permissions } from 'discord.js';

export default {
    name: 'mute',
    description: 'Mute a member in voice chat by mention with/without a period of time',
    usage: '<@member> [duration in seconds]',
    run: async (client, message, args) => {
        if (!message.member.permissions.has(Permissions.FLAGS.MUTE_MEMBERS)) {
            return message.reply('You do not have permission to use this command.');
        }

        const target = message.mentions.members.first();
        if (!target) {
            return message.reply('Please mention a member to mute.');
        }
        
        const duration = parseInt(args[1]);
        if (isNaN(duration)) {
            // Mute in text channel
            await message.channel.permissionOverwrites.edit(target, {
                SEND_MESSAGES: false
            });

            // Mute in voice channel if member is connected
            if (target.voice.channel) {
                await target.voice.setMute(true);
            }

            return message.reply(`${target.user.tag} has been muted.`);
        } else {
            // Mute for a specified duration
            await message.channel.permissionOverwrites.edit(target, {
                SEND_MESSAGES: false
            });

            // Mute in voice channel if member is connected
            if (target.voice.channel) {
                await target.voice.setMute(true);
                message.reply(`${target.user.tag} has been muted for ${duration} seconds.`);
                setTimeout(() => {
                    target.voice.setMute(false);
                    message.channel.send(`${target.user.tag} has been unmuted after ${duration} seconds.`);
                }, duration * 1000);
            } else {
                return message.reply('Member is not in a voice channel.');
            }
        }
    }
}