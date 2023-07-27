const figlet = require('figlet');
const { SlashCommandBuilder } = require('@discordjs/builders');
import { textColor } from '../../lib/colors';

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ascii')
    .setDescription('Converts text to ASCII art.')
    .addStringOption(option =>
        option
        .setName('text')
        .setDescription('The text to convert.')
        .setRequired(true))
    .addStringOption(option =>
        option
        .setName('font')
        .setDescription('The font to use.')
        .setRequired(false)),
    async execute(interaction) {
       try {
        const text = interaction.options.getString('text');
        const font = interaction.options.getString('font');
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
                    console.log(`${textColor.fgRed}❌ Something went wrong...${textColor.reset}`);
                    console.dir(err);
                    return;
                }
                interaction.reply("```\n"+ data + "\n```");
            }
        );
       }
       catch (e) {
              console.log(e)
       }
    }
}
