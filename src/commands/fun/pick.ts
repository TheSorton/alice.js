import { cleanEveryone, cleanHere } from '../../lib/sanitize.js';
import { SlashCommandBuilder } from 'discord.js';

module.exports = {
    data: new SlashCommandBuilder()
    .setName('pick')
    .setDescription('Chooses from a list of options.')
    .addStringOption(option =>
        option
        .setName('choice 1')
        .setRequired(true)
        .setName('choice 2')
        .setRequired(true)    
        .setName('choice 3')
        .setRequired(false)), 
    async execute(interaction) {    
        await interaction.reply(`I pick **${interaction.options.getString('choices')[Math.floor(Math.random() * interaction.options.getString('choices').length)]}**`)
    },
}
