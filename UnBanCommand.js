/* eslint no-restricted-syntax: "off" */
const { Command } = require('discord-akairo');
const { CreateEmbed } = require('../../Utility/CreateEmbed');
const { EmbedBuilder } = require("discord.js");
const config = require('../../config');
const { UnBan, ReturnBanList, Ban } = require('../../Utility/GuildDB');

module.exports = class UnBanCommand extends Command {
  constructor() {
    super('unban', {
      aliases: ['unban'],
      description: {
        content: 'UnBans members in VCs',
      },
      category: 'Util',
      cooldown: 3000,
    });
  }

  async exec(msg) {
    try {
      //// Clans Command Channel Checks per BOT ////
      if (msg.channel.id !== config.DefaultTextChannel) { return; }
      //if (!msg.member.voice.channelId || (msg.member.voice.channelId !== config.DefaultVoiceChannel)) { return; } 
      let OwnerException = new RegExp(config.owners.join("|"), 'gi');
      if (!msg.member.user.id.match(OwnerException)) { return; }
      ////////////////////////////////////////
      
      const QueueChannel = this.client.channels.cache.get('870609790064291851');
      let Recruit = msg.mentions.members.first();
      if (!Recruit) return msg.reply({embeds: [CreateEmbed('warn', '').setAuthor({ name: "بربك هاي مادبرتها؟  |", iconURL: msg.member.user.avatarURL({ dynamic: true }) })]}).then(msg => { setTimeout(() => msg.delete().catch(e=>{}), 5000) });
      
      let Embed = new EmbedBuilder()
      .setAuthor({ name: 
        `${Recruit.user.username} is now out of jail`
      , iconURL: Recruit.user.avatarURL({ dynamic: true }) })
      .setColor(RoleColor)
      .setImage('https://c.tenor.com/BjppE1gaAkYAAAAM/spongebob-squarepants-spongebob.gif')
      .setTimestamp();
      QueueChannel.send({ embeds: [Embed] });
      
      let role = msg.guild.roles.cache.find(r => r.id === "913468727629082664");
      Recruit.roles.remove(role);
      Recruit.voice.setChannel('885567464560275507');
      Recruit.voice.setMute(false);
      let BanList = await ReturnBanList();

      await UnBan();
      for (const key of BanList) {
        if (key !== Recruit.user.id) { await Ban(key); }
      }
    }
    catch (e) { this.client.logger.error(e.message); }
  }
}
