import { EmbedBuilder } from 'discord.js';
import prettyMilliseconds from 'pretty-ms';
import { Ban, UnBan, ReturnBanList } from '../Struct/GuildDB.js'
import { config } from '../config.js';
// const truncate = require('lodash.truncate');
// require("../Struct/EpicPlayer");
let SpammingTimes = 0;


export default {
    run: async (client, oldState, newState) => {
        // console.log("Old State:");
        // console.log("Channel ID: " + (oldState.channel ? oldState.channel.id : "None"));
        // console.log("Member ID: " + oldState.member.id);
        // console.log("Muted: " + oldState.mute);
        // console.log("Deafened: " + oldState.deaf);
        
        // console.log("New State:");
        // console.log("Channel ID: " + (newState.channel ? newState.channel.id : "None"));
        // console.log("Member ID: " + newState.member.id);
        // console.log("Muted: " + newState.mute);
        // console.log("Deafened: " + newState.deaf);
    let bannedDatabase = await ReturnBanList();
    // IF A USER IS VOICE BANNED:
    if (bannedDatabase.includes(newState.id)) {
      // LOCKING THE PRISON WHEN NO ONE IS IN IT... req:Administrator
    //   const role = newState.guild.roles.cache.get("878638612835614730");
    //   const channel = newState.guild.channels.cache.get("913502429855752243");
    //   if (channel.members.size > 0) { channel.permissionOverwrites.edit(role, { CONNECT: true }); }
    //   if (channel.members.size === 0) { channel.permissionOverwrites.edit(role, { CONNECT: false }); }

      let user = newState.guild.members.cache.get(newState.id);
      //   IF SPAMMER:
      if (SpammingTimes === 3 && !config.JailChannels.includes(newState.channelId)) {
        let role = newState.guild.roles.cache.find(r => r.id === config.JailSoloRole); // Solo Jail ROle
        user.roles.add(role);
        setTimeout(() => { user.roles.remove(role); user.voice.setChannel(oldState.channelId); }, 300000);
        let Embed = new EmbedBuilder()
        .setAuthor({ name: `تم وضعك بالسجن الأنفرادي، بطل وكاحة شوي وتطلع منه تلقائي`, iconURL: user.user.avatarURL({ dynamic: true }) })
        .setColor(config.EmbedColor)
        .setTimestamp();
        user.send("# ⚠️ تم وضعك بالسجن الأنفرادي، بطل وكاحة شوي وراح تطلع منه تلقائي");
        return user.voice.setChannel(config.JailChannels[0]); // Prison Break
      }
      if (newState.channelId !== oldState.channelId && !config.JailChannels.includes(newState.channelId)) { 
        SpammingTimes++;
        if (SpammingTimes === 1) { setTimeout(() => { SpammingTimes = 0; }, 300000); }
      };
      if (!config.JailChannels.includes(newState.channelId) && newState.serverMute === true) { return; }
      if (config.JailChannels.includes(newState.channelId) && newState.serverMute === false) { return; }
      // IF IN PRISON:
      if (config.JailChannels.includes(newState.channelId) && newState.serverMute === true) { user.voice.setMute(false); }

      // IF OUTSIDE PRISON:
      if (!config.JailChannels.includes(newState.channelId) && newState.serverMute === false) { user.voice.setMute(true); }

      // DISABLE ALL CHANNELS AND TAKE HIM TO JAIL
      //if (!config.JailChannels.includes(newState.channelId)) { user.voice.setChannel('913502429855752243'); }
    }
    
  }
};
