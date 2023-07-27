import { SlashCommandBuilder } from "discord.js";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("sex")
    .setDescription("OMG SEX UPDATE??!1?!"),
  async execute(interaction) {
    await interaction.reply(
      "https://gifdb.com/images/high/shrek-the-ogre-default-fortnite-dance-emote-awki4iykr8m85pjw.gif"
    );
  },
};
