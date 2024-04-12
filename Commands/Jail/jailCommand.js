import { EmbedBuilder } from 'discord.js';
import { CreateEmbed } from '../../Struct/CreateEmbed.js';
import { Ban } from '../../Struct/GuildDB.js'
import prettyMilliseconds from 'pretty-ms';
import { config } from '../../config.js';

export default {
    name: 'سجن',
    description: 'سجن عضو من الفويس شات فقط ومنعه من التحدث مع او بدون مدة محددة',
    usage: '<@member> [duration in minutes]',
    run: async (client, message, args) => {
    try {
      const commandsChannel = client.channels.cache.get(config.DefaultTextChannel);
      const role = message.guild.roles.cache.find(r => r.id === config.JailRole);
      let Recruit = message.mentions.members.first();
      if (!Recruit) return message.reply({embeds: [CreateEmbed('warn', '').setAuthor({ name: "بربك هاي مادبرتها؟  |", iconURL: message.member.user.avatarURL({ dynamic: true })})]}).then(msg => { setTimeout(() => msg.delete().catch(e=>{}), 5000) });
      // if (!Recruit.voice) return message.reply({embeds: [CreateEmbed('warn', '').setAuthor({ name: "العضو غير |", iconURL: message.member.user.avatarURL({ dynamic: true })})]}).then(msg => { setTimeout(() => msg.delete().catch(e=>{}), 5000) });
      

       // Check if a duration argument is provided
       const durationInMinutes = parseInt(args[1]);
       let durationInfo = '';
       if (!isNaN(durationInMinutes)) {
         // Calculate time in milliseconds
         const durationInMilliseconds = durationInMinutes * 1000 * 60;
         // Automatically remove jail role after the specified duration
         setTimeout(() => {
            Recruit.roles.remove(role);
            if (Recruit.voice?.channel) {
                try { Recruit.voice?.setMute(false); } catch {}
                setTimeout(() => { try { Recruit.voice.setChannel(null); } catch {} }, 1000);
            }
         }, durationInMilliseconds);
         durationInfo = `${durationInMinutes}`;
       }
 
       // Create embed message
       let embed = new EmbedBuilder()
         .setAuthor({ name: `${Recruit.user.globalName} تم حظره وإرساله الى السجن`, iconURL: Recruit.user.avatarURL({ dynamic: true }) })
         .setImage('https://media1.tenor.com/images/be71a3a5d0dceb5799ba887b2ae53c02/tenor.gif')
         .setColor(config.EmbedColor)
         .setTimestamp();
       
       // Add duration information if provided
       if (durationInfo) {
         embed.setAuthor({ name: `المستخدم ${Recruit.user.globalName} تم حظره وإرساله الى السجن لمدة ${durationInfo} دقيقة`, iconURL: Recruit.user.avatarURL({ dynamic: true }) })
       }
       
       // Send the embed message
       commandsChannel.send({ embeds: [embed] });
 
       // Jail the user
       Recruit.roles.add(role);
       await Ban(Recruit.user.id);
       if (Recruit.voice?.channel) {
        Recruit.voice?.setChannel(config.JailChannels[0]);
       }
    }
    catch (e) { console.log("jailCommands: " + e); }
  }
}
