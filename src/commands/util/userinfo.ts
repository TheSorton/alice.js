import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

/* Write a slash command that will gather information about a user and display it 
in an embed */

// From date to unix timestamp


module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Get information about a user')
        .addUserOption(option => option.setName('user').setDescription('The user')),
    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;
        const member = interaction.guild.members.cache.get(user.id);

        const embed = new EmbedBuilder()
            .setAuthor({ name: user.username, iconURL: user.displayAvatarURL({size: 4096}) })
            .setThumbnail(user.displayAvatarURL({size: 4096}))
            const fields = [
                { name: 'ID', value: user.id, inline: true },
                { name: 'Username', value: user.username, inline: true },
                { name: 'Bot', value: user.bot ? 'Yes' : 'No', inline: true },
                { name: 'Account Created', value: `<t:${(user.createdAt.getTime() / 1000).toFixed(0)}:F>` },
                { name: 'Date joined', value: `<t:${(member.joinedAt.getTime() / 1000).toFixed(0)}:F>` },
                { name: 'Roles', value: member.roles.cache.map(role => role.toString()).join(' '), inline: true },
            ]
            embed.addFields(fields)
            embed.setTimestamp();


        await interaction.reply({ embeds: [embed] });
    }
}