import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction} from 'discord.js';
import axios from 'axios';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('man')
    .setDescription('Returns the man page for a given Unix command')
    .addStringOption(option =>
      option.setName('command')
        .setDescription('The Unix command to look up')
        .setRequired(true)
    ),
  async execute(interaction: CommandInteraction) {
    // use axios to get man page from https://www.mankier.com/api/v2/mans/
    const command = interaction.options.get('command');
    const url: string = `https://www.mankier.com/api/v2/mans/${command}`;
    const response = await axios.get(url);
    await interaction.reply(response.data[0]);
}};