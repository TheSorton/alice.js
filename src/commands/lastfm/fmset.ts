import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import mongoose from "mongoose";
// Write a slash command that uses mongoose to set a users last.fm name

module.exports = {
    data: new SlashCommandBuilder()
        .setName("fmset")
        .setDescription("Sets your last.fm username.")
        .addStringOption(option =>
            option.setName("username")
                .setDescription("Your last.fm username.")
                .setRequired(true)
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        const username = interaction.options.getString("username");
        // use mongoose to set the users last.fm username
        let user = await mongoose.model("User").findOne({ userID: interaction.user.id });
        if (!user) {
            user = await mongoose.model("User").create({
                userID: interaction.user.id,
                lastfm: username,
            });
        }
        else {
            user.lastfm = username;
            await user.save();
        }
        await interaction.reply({ content: `Your last.fm username has been set to ${username}.`, ephemeral: true});    
    },
};
