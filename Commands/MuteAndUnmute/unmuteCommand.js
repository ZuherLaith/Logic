import Discord, { ChannelType }  from 'discord.js';
import { config } from '../../config.js';
import { consoleLog, consoleWarn, consoleError } from '../../Struct/logger.js';

export default {
    name: 'فك.ميوت',
    description: 'فك ميوت عضو محدد من الفويس والمحادثة.',
    usage: '<@mention>',
    run: async (client, message, args) => {
        consoleLog(`Member [${message.member.displayName}] is using Unmute Command, (${message.content})`)
        try {
            if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.MuteMembers)) {
                return message.reply('**⛔ ليس لديك الصلاحيات لإستخدام هذا الأمر.**').then(msg => { setTimeout(() => msg.delete().catch(e=>{}), 6000) });
            }
    
            const target = message.mentions.members.first();
            const role = message.guild.roles.cache.find(r => r.id === config.MuteRole);

            if (!target) {
                return message.reply('**⚠️ منشن العضو الذي تريد تنفيذ الأمر عليه.**').then(msg => { setTimeout(() => msg.delete().catch(e=>{}), 6000) });
            }
    
            target.roles.remove(role);
            
            if (target.voice?.channel) { target.voice?.setMute(false); }
            message.reply(`**<@${target.user.id}> has been unmuted.**`).then(msg => { setTimeout(() => msg.delete().catch(e=>{}), 6000) });
        }
        catch(e) { consoleError("unmuteCommand: " + e) }
    }
}