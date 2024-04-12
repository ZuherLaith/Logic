import { readdirSync } from 'fs';
// import { CreateEmbed } from '../../Struct/CreateEmbed.js';
import { EmbedBuilder } from 'discord.js';
import { config } from '../../config.js';
import { join, relative } from 'path';

const prefix = config.prefix;

export default {
    name: 'الاوامر',
    description: 'عرض قائمة الاوامر',
    usage: '',
    run: async (client, message, args) => {
        if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
            return message.reply('⛔ ليس لديك الصلاحيات لإستخدام هذا الأمر.').then(msg => { setTimeout(() => msg.delete().catch(e=>{}), 6000) });
        }
        
        function getCommands(dir) {
            const dirents = readdirSync(dir, { withFileTypes: true });
            const files = dirents
                .filter(dirent => dirent.isFile() && dirent.name.endsWith('.js'))
                .map(dirent => join(dir, dirent.name));
            const folders = dirents.filter(dirent => dirent.isDirectory());
        
            let commandFiles = [];
        
            for (const folder of folders) {
                const folderFiles = getCommands(join(dir, folder.name));
                commandFiles = commandFiles.concat(folderFiles);
            }
        
            return files.concat(commandFiles);
        }
        

        const rootDir = './Commands/';
        const commandFiles = getCommands(rootDir);
        const commandList = [];

        for (const file of commandFiles) {
            const command = await import(`../../${file}`);
            if (command.default.name) {
                commandList.push(`<a:image5:825489545768075274> **${prefix}${command.default.name}** <a:image5:825489545768075274> \n${command.default.description}\n> Usage: ${prefix}${command.default.name} ${command.default.usage}`);
            }
        }
        
        const helpEmbed = new EmbedBuilder()
            // .setAuthor('')
            .setDescription(commandList.join('\n\n'))
            .setColor(config.EmbedColor) // Green color for the embed
            .setFooter({ text: `Use ${prefix}<command> to get more details about a specific command`, iconURL: message.author.avatarURL({ dynamic: true }) })

        message.channel.send({ content: '# 🌐 قائمة الاوامر', embeds: [helpEmbed] }); //.then(msg => { setTimeout(() => msg.delete().catch(e=>{}), 30000) });
    },
};