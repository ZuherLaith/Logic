import { ChannelType }  from 'discord.js';
import Discord from 'discord.js';

export default {
    name: 'فك.ميوت',
    description: 'فك ميوت عضو محدد من الفويس والمحادثة.',
    usage: '<@mention>',
    run: async (client, message, args) => {
        async function slowPermissionEdit(message, target) {
            const textChannels = Array.from(message.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildText).values());
            const voiceChannels = Array.from(message.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildVoice).values());
        
            // Define a function to edit permission overwrites with a delay
            async function editPermissions(channelArray) {
                for (const channel of channelArray) {
                    await channel.permissionOverwrites.delete(target);
                    await new Promise(resolve => setTimeout(resolve, 500)); // 1000ms delay
                }
            }
        
            // Edit permission overwrites for text channels with a delay
            await editPermissions(textChannels);
        
            // Edit permission overwrites for voice channels with a delay
            await editPermissions(voiceChannels);
        }

        try {
            if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.MuteMembers)) {
                return message.reply('⛔ ليس لديك الصلاحيات لإستخدام هذا الأمر.').then(msg => { setTimeout(() => msg.delete().catch(e=>{}), 6000) });
            }
    
            const target = message.mentions.members.first();
            if (!target) {
                return message.reply('Please mention a member to unmute.').then(msg => { setTimeout(() => msg.delete().catch(e=>{}), 6000) });
            }
    
            slowPermissionEdit(message, target)
                .then(() => console.log("Permissions edited successfully with delay"))
                .catch(error => console.error("Error editing permissions:", error));
            
            if (target.voice?.channel) { target.voice?.setMute(false); }
            message.reply(`<@${target.user.id}> has been unmuted.`).then(msg => { setTimeout(() => msg.delete().catch(e=>{}), 6000) });
        }
        catch(e) { console.log("unmuteCommand: " + e) }
    }
}