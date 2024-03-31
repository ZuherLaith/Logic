import Discord, { ChannelType }  from 'discord.js';

export default {
    name: 'unmute',
    description: 'Unmute a member in voice chat by mention',
    usage: '<@member>',
    run: async (client, message, args) => {
        try {
            if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.MuteMembers)) {
                return message.reply('You do not have permission to use this command.');
            }
    
            const target = message.mentions.members.first();
            if (!target) {
                return message.reply('Please mention a member to unmute.');
            }
    
            message.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildText).forEach(async channel => {
                await channel.permissionOverwrites.delete(target);
            });
            message.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildVoice).forEach(async channel => {
                await channel.permissionOverwrites.delete(target);
            });
            
            if (target.voice?.channel) { target.voice?.setMute(false); }
            message.reply(`<@${target.user.id}> has been unmuted.`);
        }
        catch(e) { console.log("unmuteCommand: " + e) }
    }
}