import figlet from "figlet";
import { SlashCommandBuilder } from "@discordjs/builders";
import { textColor } from "../../lib/colors";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ascii")
    .setDescription("Converts text to ASCII art.")
    .addStringOption((option) =>
      option
        .setName("text")
        .setDescription("The text to convert.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("font")
        .setDescription("The font to use.")
        .setRequired(false)
        .addChoices(
          { name: "3-d", value: "3-d" },
          { name: "3x5", value: "3x5" },
          { name: "5lineoblique", value: "5lineoblique" },
          { name: "acrobatic", value: "acrobatic" },
          { name: "alligator", value: "alligator" },
          { name: "alligator2", value: "alligator2" },
          { name: "alphabet", value: "alphabet" },
          { name: "doom", value: "doom" },
          { name: "dotmatrix", value: "dot matrix" },
          { name: "dr pepper", value: "dr pepper" },
          { name: "eftichess", value: "efti chess" },
          { name: "isometric1", value: "isometric1" },
          { name: "isometric2", value: "isometric2" },
          { name: "isometric3", value: "isometric3" },
          { name: "isometric4", value: "isometric4" },
          { name: "larry3d", value: "larry 3d" },
          { name: "hex", value: "hex" },
          { name: "binary", value: "binary" },
          { name: "octal", value: "octal" },
          { name: "small", value: "small" },
          { name: "big", value: "big" },
          { name: "block", value: "block" },
          { name: "broadway", value: "broadway" },
          { name: "merlin", value: "merlin" },
          { name: "poison", value: "poison" },
        ) 
    ),
    
  async execute(interaction) {
    try {
      const text = interaction.options.getString("text");
      const font = interaction.options.getString("font");
      figlet.text(
        text,
        {
          font: font,
          horizontalLayout: "default",
          verticalLayout: "default",
          width: 80,
          whitespaceBreak: true,
        },
        function (err, data) {
          if (err) {
            console.log(
              `${textColor.fgRed}❌ Something went wrong...${textColor.reset}`
            );
            console.dir(err);
            return;
          }
          interaction.reply("```\n" + data + "\n```");
        }
      );
    } catch (e) {
      console.log(e);
    }
  },
};
