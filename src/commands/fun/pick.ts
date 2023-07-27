import { SlashCommandBuilder } from "discord.js";

// Write a slash command to pick from user inputs
// and return a random one.

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pick")
    .setDescription(
      "Picks from a list of options. Separate options with a comma and a space."
    )
    .addStringOption((option) =>
      option
        .setName("options")
        .setDescription(
          "The options to pick from. Separate options with a comma and a space."
        )
        .setRequired(true)
    ),
  async execute(interaction) {
    const options: string[] = interaction.options
      .getString("options")
      .split(", ");
    const choice: string = options[Math.floor(Math.random() * options.length)];
    interaction.reply(`I choose ${choice}.`);
  },
};
