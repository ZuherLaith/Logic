import { config } from '../../config.js';
import Discord from 'discord.js';

export default {
    name: 'مسح',
    description: 'مسح العدد المطلوب من الرسائل',
    usage: '<amount>',
    run: async (client, message, args) => {
        try 
        {
            if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
                return message.reply('**⛔ ليس لديك الصلاحيات لإستخدام هذا الأمر.**').then(msg => { setTimeout(() => msg.delete().catch(e=>{}), 6000) });
            }
            const amount = message.content.split(' ').slice(1).join(' ')
            if (!amount) { amount = 1 }
            const allMessages = await message.channel.messages.fetch({limit: amount});
            const deletable = allMessages.filter(message => !message.pinned);
            await message.channel.bulkDelete(deletable, true);
            
            message.channel.send(`**.مسح ${amount} رسالة ✅**`).then(msg => { setTimeout(() => msg.delete().catch(e=>{}), 6000) });
        }
        catch (e) { console.log(e) }
    }
}