import { EmbedBuilder, ActionRowBuilder, ButtonBuilder } from 'discord.js';
import { config } from '../../config.js';

const voteKickDuration = 30 * 1000; // 30 seconds
const kickDuration = 15 * 60 * 1000; // 15 minutes
const votedMembers = new Set();

export default {
    name: 'vote',
    description: 'تصويت طرد عضو من الفويس شات ومنع دخوله لمدة 30 دقيقة',
    run: async (client, message, args) => {
	// console.log(interaction);
    //     console.log("client: " + client)
    //     console.log("Message: " + message)
    //     console.log("Args: " + args[0])
        // await interaction.reply('This is a response to your command!');
        const YesButton = new ButtonBuilder()
        .setCustomId('YesButton')
        .setLabel('نعم')
        .setStyle('Success')
        .setEmoji('👍');
        const NoButton = new ButtonBuilder()
        .setCustomId('NoButton')
        .setLabel('لا')
        .setStyle('Danger')
        .setEmoji('👎');
        const VoteButtons = new ActionRowBuilder().addComponents(YesButton, NoButton);
        // client.channels.cache.get("1222227911277543494");
        // Clear the voted members table each time a new vote begins
        votedMembers.clear();
        // Check if the message author is in a voice channel
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return message.reply('⛔ يجب عليك الانضمام الى فويس اولاً');
        }
        
        // Check if the voice channel has more than one member
        if (voiceChannel.members.size <= 2) {
            return message.reply('⚠️ لا يوجد عدد اشخاص اكثر من 2 بالفويس');
        }

        // Get the member to be kicked
        const memberToKick = message.mentions.members.first();
        if (!memberToKick) {
            return message.reply('⛔ لا يوجد عضو بهذا الإسم');
        }

        // Check if both the member to be kicked and the requester are in the same voice channel
        if (!memberToKick.voice.channel || memberToKick.voice.channelId !== voiceChannel.id) {
            return message.reply('⛔ يجب ان يكون الشخص المقصود بالطرد متواجد معك بالفويس');
        }


        // Send vote kick embed with buttons
        const embed = new EmbedBuilder()
            .setTitle('⚠️ تصويت بالطرد ⚠️')
            .setDescription(`هل تود الموافقة على طرد <@${memberToKick.user.id}> من <#${voiceChannel.id}> ؟

            > بدأ التصويت لمدة 15 ثانية`)
            .setThumbnail('https://cdn.discordapp.com/emojis/855479321219956778.png')
            .setColor(config.EmbedColor)
            .setTimestamp();

        const voteKickMessage = await message.channel.send({ embeds: [embed], components: [VoteButtons]});

        // Collect button interactions
        const filter = interaction => interaction.user.id !== client.user.id;
        const collector = voteKickMessage.createMessageComponentCollector({ filter, time: voteKickDuration });

        let yesVotes = 0;
        let noVotes = 0;

        collector.on('collect', interaction => {
            // Check if the member has already voted
            if (votedMembers.has(interaction.user.id)) {
                interaction.reply({ content: '⛔ لقد قمت بالتصويت مسبقاً', ephemeral: true });
                return;
            }
            // Check if the member to be kicked is interacting with the buttons
            if (interaction.member.id === memberToKick.id) {
                interaction.reply({ content: '⛔ لا يمكنك التصويت هنا، شهالسياسة التعبانة؟', ephemeral: true });
                return;
            }

            // Check if the user is in the same voice channel
            const userVoiceChannelId = interaction.member.voice.channelId;
            if (userVoiceChannelId !== voiceChannel.id) {
                interaction.reply({ content: '⛔ يجب أن تكون ضمن المتواجدين بالفويس للمشاركة', ephemeral: true });
                return;
            }

            // Process the vote
            if (interaction.customId === 'YesButton') {
                yesVotes++;
            } else if (interaction.customId === 'NoButton') {
                noVotes++;
            }
        
            // Add the member to the set of voted members
            votedMembers.add(interaction.user.id);

            interaction.reply({ content: '✅ تمت المشاركة بالتصويت', ephemeral: true });
        
            // Defer the update of the button interaction
            // interaction.deferUpdate();
        
            console.log(`Yes Votes: ${yesVotes}, No Votes: ${noVotes}`);
        });

        collector.on('end', async () => {
            // Calculate the vote result
            const totalVotes = yesVotes + noVotes;
            const threshold = Math.ceil(voiceChannel.members.size / 2);
            const noThreshold = Math.floor(voiceChannel.members.size / 2);
            voteKickMessage.delete();

            if (totalVotes === 0) {
                await message.channel.send(`🙅🏻‍♂️ فشلت عملية تصويت طرد <@${memberToKick.user.id}> بسبب عدم المشاركة بالتصويت`);
            }
            else if (yesVotes > noVotes) {
                // Kick the member
                await memberToKick.voice?.setChannel(null);
                await message.channel.send(`العضو <@${memberToKick.user.id}> تم طرده من الفويس <#${voiceChannel.id}> ولمدة 15 دقيقة ✅`);
                // Prevent rejoining for 15 minutes
                await voiceChannel.permissionOverwrites.edit(memberToKick, {
                    Connect: false
                });
                
                setTimeout(() => {
                    voiceChannel.permissionOverwrites.delete(target);
                }, kickDuration);
            }
            else if (yesVotes < noVotes) {
                await message.channel.send(`🙅🏻‍♂️ فشلت عملية تصويت طرد <@${memberToKick.user.id}> بسبب الاتفاق على عدم طرده`);
            }
            else if (yesVotes === noVotes) {
                await message.channel.send(`🙅🏻‍♂️ فشلت عملية تصويت طرد <@${memberToKick.user.id}> بسبب تعادل نتائج التصويت`);
            }
        });

    }
}