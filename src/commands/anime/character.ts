import {
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  EmbedBuilder,
  ComponentType,
  SlashCommandBuilder,
} from "discord.js";
import anilist from "anilist-node";
import { htmlToMarkdown } from "../../lib/html2md";
const Anilist = new anilist();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("character")
    .setDescription("Searches AniList for a character")
    .addStringOption((option) =>
      option
        .setName("character")
        .setDescription("The character to search")
        .setRequired(true)
    ),
  async execute(interaction) {

    const getId = async (query) => {
      const data = await Anilist.searchEntry.character(query);
      return data.characters;
    };

    const idArray = await getId(interaction.options.getString("character"));
    //console.log(idArray)
    const id = idArray[0] != null ? idArray[0].id : null;

    if (!id) {
      return interaction.reply("Not found.");
    }

    let currentIndex = 0; // initialize the current index to 0

    const getData = async (index) => {
      const characterId = idArray[index].id;
      return await Anilist.people.character(characterId);
    };

    const buildEmbed = (data) => {
      const embed = new EmbedBuilder();
      if (!data.name.english) {
        embed.setAuthor({ name: `${data.name.native}` });
      } else {
        embed.setAuthor({ name: `${data.name.english} (${data.name.native})` });
      }
      if (data.description) {
        embed.setDescription(
          htmlToMarkdown(" >>> " + data.description.substring(0, 500) + "...")
        );
      }
      embed.setImage(data.image.large);
      const fields = [
        data.media[0].title.userPreferred && {
          name: "Anime",
          value: data.media[0].title.userPreferred,
          inline: false,
        },
      ].filter(Boolean);

      embed.addFields(fields);

      return embed;
    };

    const next = new ButtonBuilder()
      .setCustomId("next")
      .setLabel("Next")
      .setStyle(ButtonStyle.Primary);

    const previous = new ButtonBuilder()
      .setCustomId("previous")
      .setLabel("Previous")
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(previous, next);

    const message = await interaction.reply({
      embeds: [buildEmbed(await getData(currentIndex))],
      components: [row],
    });

    const collector = message.createMessageComponentCollector({
      componentType: ComponentType.Button,
    });

    collector.on("collect", async (buttonInteraction) => {
      const { customId } = buttonInteraction;

      if (customId === "next") {
        currentIndex++;
      } else if (customId === "previous") {
        currentIndex--;
      }

      if (currentIndex < 0) {
        currentIndex = idArray.length - 1;
      } else if (currentIndex >= idArray.length) {
        currentIndex = 0;
      }

      const newData = await getData(currentIndex);
      const newEmbed = buildEmbed(newData);

      await buttonInteraction.update({
        embeds: [newEmbed],
        components: [row],
      });
    });
  },
};
