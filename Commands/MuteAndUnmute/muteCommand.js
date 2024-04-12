import Discord, { ChannelType } from 'discord.js';

export default {
    name: 'ميوت',
    description: 'ميوت بالمنشن من الشات والفويس شات مع او بدون مدة محددة',
    usage: '<@mention> [duration in minutes]',
    run: async (client, message, args) => {
        async function slowPermissionEdit(message, target) {
            const textChannels = Array.from(message.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildText).values());
            const voiceChannels = Array.from(message.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildVoice).values());
        
            // Define a function to edit permission overwrites with a delay
            async function editPermissions(channelArray) {
                for (const channel of channelArray) {
                    await channel.permissionOverwrites.edit(target, {
                        SendMessages: false
                    });
                    await new Promise(resolve => setTimeout(resolve, 500)); // 1000ms delay
                }
            }
        
            // Edit permission overwrites for text channels with a delay
            await editPermissions(textChannels);
        
            // Edit permission overwrites for voice channels with a delay
            await editPermissions(voiceChannels);
        }

        try 
        {
            if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.MuteMembers)) {
                return message.reply('⛔ ليس لديك الصلاحيات لإستخدام هذا الأمر.').then(msg => { setTimeout(() => msg.delete().catch(e=>{}), 6000) });
            }

            const target = message.mentions.members.first();
            if (!target) {
                return message.reply('Please mention a member to mute.').then(msg => { setTimeout(() => msg.delete().catch(e=>{}), 6000) });
            }
            
            const duration = parseInt(args[1]);
            if (isNaN(duration)) {
                console.log("passed")
                // Mute in text channels
                slowPermissionEdit(message, target)
                .then(() => console.log("Permissions edited successfully with delay"))
                .catch(error => console.error("Error editing permissions:", error));

                // Mute in voice channel if member is connected
                if (target.voice?.channel) {
                    await target.voice?.setMute(true);
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