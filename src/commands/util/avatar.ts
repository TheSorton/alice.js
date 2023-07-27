import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

module.exports = {
    data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Gets the avatar of a user.')
    .addUserOption(option =>
        option
        .setName('user')
        .setDescription('The user to get the avatar of.')
        .setRequired(false)),
    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;
        const embed = new EmbedBuilder();
        embed.setAuthor({name: `${user.username}`,iconURL: user.displayAvatarURL({dynamic: true, size: 4096})});
        embed.setImage(user.displayAvatarURL({dynamic: true, size: 4096}));
        interaction.reply({embeds: [embed]});
    }
}