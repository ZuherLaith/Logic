import { config } from '../../config.js';
import { CreateEmbed } from '../../Utility/CreateEmbed.js';
import Discord from 'discord.js';

export default {
    name: 'delete',
    description: 'Delete the needed amount of messages',

    run: async (client, message, args) => {
        try 
        {
            if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
                return message.reply('**⛔ ليس لديك الصلاحيات لإستخدام هذا الأمر.**').then(msg => { setTimeout(() => msg.delete().catch(e=>{}), 6000) });
            }
            const amount = message.content.split(' ').slice(1).join(' ')
            console.log(amount)
            if (!amount) { amount = 1 }
            const allMessages = await message.channel.messages.fetch({limit: amount});
            const deletable = allMessages.filter(message => !message.pinned);
            await message.channel.bulkDelete(deletable, true);
            
            message.channel.send({embeds: [CreateEmbed().setAuthor({ name: `**رسالة ${amount} مسح ✅.**`, iconURL: message.member.user.avatarURL({ dynamic: true })})]}).then(msg => { setTimeout(() => msg.delete().catch(e=>{}), 6000) });
        }
        catch (e) { console.log(e) }
    }
}