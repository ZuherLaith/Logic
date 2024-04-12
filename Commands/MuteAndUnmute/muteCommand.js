import Discord, { ChannelType } from 'discord.js';

export default {
    name: 'ميوت',
    description: 'ميوت بالمنشن من الشات والفويس شات مع او بدون مدة محددة',
    usage: '<@mention> [duration in minutes]',
    run: async (client, message, args) => {
        try 
        {
            if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.MuteMembers)) {
                return message.reply('You do not have permission to use this command.').then(msg => { setTimeout(() => msg.delete().catch(e=>{}), 6000) });
            }

            const target = message.mentions.members.first();
            if (!target) {
                return message.reply('Please mention a member to mute.').then(msg => { setTimeout(() => msg.delete().catch(e=>{}), 6000) });
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

                return message.reply(`<@${target.user.id}> has been muted.`).then(msg => { setTimeout(() => msg.delete().catch(e=>{}), 6000) });
            } else {
                // Mute for a specified duration
                message.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildText).forEach(async channel => {
                    await channel.permissionOverwrites.delete(target);
                });
                message.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildVoice).forEach(async channel => {
                    await channel.permissionOverwrites.delete(target);
                });

                // Mute in voice channel if member is connected
                if (target.voice.channel) {
                    if (target.voice?.channel) { await target.voice?.setMute(true); }
                    message.reply(`<@${target.user.id}> has been muted for ${duration} minutes.`).then(msg => { setTimeout(() => msg.delete().catch(e=>{}), 6000) });
                    setTimeout(async () => {
                        if (target.voice?.channel) { await target.voice?.setMute(false); }

                        // Unmute for a specified duration
                        message.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildText).forEach(async channel => {
                            await channel.permissionOverwrites.edit(target, {
                                SendMessages: falstre
                            });
                        });
                        message.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildVoice).forEach(async channel => {
                            await channel.permissionOverwrites.edit(target, {
                                SendMessages: false
                            });
                        });

                        message.channel.send(`<@${target.user.id}> has been unmuted for ${duration} minutes.`).then(msg => { setTimeout(() => msg.delete().catch(e=>{}), 6000) });
                    }, duration * 1000 * 60);
                } else {
                    return message.reply('Member is not in a voice channel.').then(msg => { setTimeout(() => msg.delete().catch(e=>{}), 6000) });
                }
            }
        }
        catch (e) { console.log("muteCommand: " + e); }
    }
}