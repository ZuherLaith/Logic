import Discord, { ChannelType }  from 'discord.js';

export default {
    name: 'فك.ميوت',
    description: 'فك ميوت عضو محدد من الفويس والمحادثة.',
    usage: '<@mention>',
    run: async (client, message, args) => {
        try {
            if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.MuteMembers)) {
                return message.reply('⛔ ليس لديك الصلاحيات لإستخدام هذا الأمر.').then(msg => { setTimeout(() => msg.delete().catch(e=>{}), 6000) });
            }
    
            const target = message.mentions.members.first();
            if (!target) {
                return message.reply('Please mention a member to unmute.').then(msg => { setTimeout(() => msg.delete().catch(e=>{}), 6000) });
            }
    
            message.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildText).forEach(async channel => {
                await channel.permissionOverwrites.delete(target);
            });
            message.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildVoice).forEach(async channel => {
                await channel.permissionOverwrites.delete(target);
            });
            
            if (target.voice?.channel) { target.voice?.setMute(false); }
            message.reply(`<@${target.user.id}> has been unmuted.`).then(msg => { setTimeout(() => msg.delete().catch(e=>{}), 6000) });
        }
        catch(e) { console.log("unmuteCommand: " + e) }
    }
}