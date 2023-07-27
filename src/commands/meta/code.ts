import { SlashCommandBuilder } from "discord.js";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("code")
    .setDescription("Returns the bot's Github."),
  async execute(interaction) {
    interaction.reply("https://github.com/thesorton/alice/tree/slash");
  },
};
