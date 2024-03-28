import Discord, { ChannelType } from 'discord.js';

export default {
    name: 'mute',
    description: 'Mute a member in voice chat by mention with/without a period of time',
    usage: '<@member> [duration in minutes]',
    run: async (client, message, args) => {
        try 
        {
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
                message.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildText).forEach(async channel => {
                    await channel.permissionOverwrites.edit(target, {
                        SendMessages: false
                    });
                });
                message.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildVoice).forEach(async channel => {
                    await channel.permissionOverwrites.edit(target, {
                        SendMessages: false
                    });
                });

                // Mute in voice channel if member is connected
                if (target.voice.channel) {
                    await target.voice.setMute(true);
                }

                return message.reply(`<@${target.user.id}> has been muted in all text channels.`);
            } else {
                // Mute for a specified duration
                message.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildText).forEach(async channel => {
                    await channel.permissionOverwrites.edit(target, {
                        SEND_MESSAGES: false
                    });
                });
                message.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildVoice).forEach(async channel => {
                    await channel.permissionOverwrites.edit(target, {
                        SEND_MESSAGES: false
                    });
                });

                // Mute in voice channel if member is connected
                if (target.voice.channel) {
                    await target.voice.setMute(true);
                    message.reply(`<@${target.user.id}> has been muted for ${duration} minutes in all text channels.`);
                    setTimeout(async () => {
                        await target.voice.setMute(false);
                        message.channel.send(`<@${target.user.id}> has been unmuted after ${duration} minutes in all text channels.`);
                    }, duration * 1000 * 60);
                } else {
                    return message.reply('Member is not in a voice channel.');
                }
            }
        }
        catch (e) { console.log("muteCommand: " + e); }
    }
}