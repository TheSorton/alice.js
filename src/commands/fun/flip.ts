import { SlashCommandBuilder } from 'discord.js';

// Write a slash command that flips a coin
// and returns heads or tails.

module.exports = {
    data: new SlashCommandBuilder()
    .setName('flip')
    .setDescription('Flips a coin.'),
    async execute(interaction) {
        const choice = Math.floor(Math.random() * 2) == 0 ? "Heads" : "Tails";
        interaction.reply(`It's ${choice}.`);
    }
}
