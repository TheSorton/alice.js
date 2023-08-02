import { SlashCommandBuilder } from "@discordjs/builders";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("color")
    .setDescription("Returns an image of a color based on user input hex code.")
    .addStringOption((option) =>
      option
        .setName("hex")
        .setDescription("The hex code of the color.")
        .setRequired(true)
        .setMinLength(6)
        .setMaxLength(6)
    )
    .addStringOption((option) =>
      option
        .setName("text")
        .setDescription("The text to display on the image.")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("size")
        .setDescription("The size of the image. Will be square.")
        .setRequired(false)
        .setMinLength(3)
        .setMaxLength(4)
    ),

  async execute(interaction) {
    const hex: string = interaction.options.getString("hex");
    const color: string = hex.replace("#", "");

    let text: string;
    if (interaction.options.getString("text")) {
      text = interaction.options.getString("text").replace(/\s/g, "%20");
    } else {
      text = color;
    }
    
    const size: string = interaction.options.getString("size") || "500";
    const url: string = `https://dummyimage.com/${size}x${size}/${color}/000000.png&text=${text}`;
    interaction.reply(url);
  },
};
