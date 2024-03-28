import { EmbedBuilder } from 'discord.js';

const Color = {
  info: '#c6d7f5',
  warn: '#FFFF00',
  error: '#FF0000',
};

const CreateEmbed = (color, message) => {
  Color.info = RoleColor; // Assuming RoleColor is defined elsewhere
  const embed = new EmbedBuilder()
    .setColor(Color[color]);
    //.setFooter(`© カグチ ${new Date().getFullYear()}`);
  if (message) embed.setDescription(message);
  return embed;
};

export { CreateEmbed };