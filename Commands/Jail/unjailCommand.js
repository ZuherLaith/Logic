import { EmbedBuilder } from 'discord.js';
import Discord from 'discord.js';
import { CreateEmbed } from '../../Struct/CreateEmbed.js';
import { UnBan, ReturnBanList, Ban } from '../../Struct/GuildDB.js'
import prettyMilliseconds from 'pretty-ms';
import { config } from '../../config.js';

export default {
    name: 'فك.سجن',
    description: 'فك سجن عضو تم سجنه مسبقاً',
    usage: '<@mention>',
    run: async (client, message, args) => {
    try {
      if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
        return message.reply('⛔ ليس لديك الصلاحيات لإستخدام هذا الأمر.').then(msg => { setTimeout(() => msg.delete().catch(e=>{}), 6000) });
      }

      const commandsChannel = client.channels.cache.get(config.DefaultTextChannel);
      let Recruit = message.mentions.members.first();
      if (!Recruit) return message.reply({embeds: [CreateEmbed('warn', '').setAuthor({ name: "بربك هاي مادبرتها؟  |", iconURL: message.member.user.avatarURL({ dynamic: true }) })]}).then(msg => { setTimeout(() => msg.delete().catch(e=>{}), 5000) });
      
      let Embed = new EmbedBuilder()
      .setAuthor({ name: 
        `${Recruit.user.globalName} تم إخراجه من السجن`
      , iconURL: Recruit.user.avatarURL({ dynamic: true }) })
      .setColor(config.EmbedColor)
      .setImage('https://c.tenor.com/BjppE1gaAkYAAAAM/spongebob-squarepants-spongebob.gif')
      .setTimestamp();
      commandsChannel.send({ embeds: [Embed] });
      
      let role = message.guild.roles.cache.find(r => r.id === config.JailRole);
      await Recruit.roles.remove(role);
      if (Recruit.voice?.channel) {
        await Recruit.voice.setMute(false);
        await Recruit.voice.setChannel(null);
      }
      let BanList = await ReturnBanList();

      await UnBan();
      for (const key of BanList) {
        if (key !== Recruit.user.id) { await Ban(key); }
      }
    }
    catch (e) { console.log("UnjailCommand: " + e) }
  }
}
