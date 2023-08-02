import { SlashCommandBuilder } from "@discordjs/builders";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("color")
        .setDescription("Returns an image of a color based on user input hex code.")
        .addStringOption((option) => option
        .setName("hex")
        .setDescription("The hex code of the color.")
        .setRequired(true)),
    async execute(interaction) {
        const hex: string = interaction.options.getString("hex");
        const color: string = hex.replace("#", "");
        const url: string = `https://dummyimage.com/400x400/${color}/000000.png&text=${color}`;
        interaction.reply(url);
    },
};
