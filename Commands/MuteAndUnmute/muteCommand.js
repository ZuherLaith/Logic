import Discord, { ChannelType } from 'discord.js';
import { config } from '../../config.js';
import { consoleLog, consoleWarn, consoleError } from '../../Struct/logger.js';

export default {
    name: 'ميوت',
    description: 'ميوت بالمنشن من الشات والفويس شات مع او بدون مدة محددة',
    usage: '<@mention> [duration in minutes]',
    run: async (client, message, args) => {
        consoleLog(`Member [${message.member.displayName}] is using Mute Command, (${message.content})`)
        try 
        {
            if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.MuteMembers)) {
                return message.reply('**⛔ ليس لديك الصلاحيات لإستخدام هذا الأمر.**').then(msg => { setTimeout(() => msg.delete().catch(e=>{}), 6000) });
            }

            const target = message.mentions.members.first();
            if (!target) {
                return message.reply('**منشن العضو الذي تريد تنفيذ الأمر عليه.**').then(msg => { setTimeout(() => msg.delete().catch(e=>{}), 6000) });
            }
            
            const duration = parseInt(args[1]);
            const role = message.guild.roles.cache.find(r => r.id === config.MuteRole);
            if (isNaN(duration)) {
                // Mute in text channels
                target.roles.add(role);

                // Mute in voice channel if member is connected
                if (target.voice?.channel) {
                    await target.voice?.setMute(true);
                }

                return message.reply(`**<@${target.user.id}> has been muted.**`).then(msg => { setTimeout(() => msg.delete().catch(e=>{}), 6000) });
            } else {
                // -- Mute for a specified duration --
                target.roles.add(role);
                // Mute in voice channel if member is connected
                if (target.voice?.channel) { await target.voice?.setMute(true); }
                // Finalize with a message
                message.reply(`**<@${target.user.id}> has been muted for ${duration} minutes.**`).then(msg => { setTimeout(() => msg.delete().catch(e=>{}), 6000) });

                // Set the timer for a specific duration
                setTimeout(async () => {
                    if (target.voice?.channel) { await target.voice?.setMute(false); }

                    // Unmute for a specified duration
                    target.roles.remove(role);

                    message.channel.send(`**<@${target.user.id}> has been unmuted for ${duration} minutes.**`).then(msg => { setTimeout(() => msg.delete().catch(e=>{}), 6000) });
                }, duration * 1000 * 60);
            }
        }
        catch (e) { consoleError("muteCommand: " + e); }
    }
}