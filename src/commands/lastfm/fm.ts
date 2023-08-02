import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
} from "discord.js";
import mongoose from "mongoose";
import axios from "axios";
import * as config from "../../../config/config.json";

// Write a slash command that uses mongoose and axios and the last.fm api to get a users last.fm data

module.exports = {
  data: new SlashCommandBuilder()
    .setName("fm")
    .setDescription("Gets your last.fm data."),
  async execute(interaction: ChatInputCommandInteraction) {
    // use mongoose to get the users last.fm username
    const user = await mongoose
      .model("User")
      .findOne({ userID: interaction.user.id });
    if (!user) {
      await interaction.reply({
        content: "You haven't set your last.fm username yet.",
        ephemeral: true,
      });
      return;
    }
    // use axios to get the users last.fm data
    const { data } = await axios.get(
      `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${user.lastfm}&api_key=${config.lastfm.apikey}&format=json`
    );
    const track = data.recenttracks.track[0];
    const embed = new EmbedBuilder()
      .setURL(`https://www.last.fm/user/${user.lastfm}`)
      .setThumbnail(track.image[3]["#text"]);
    if (!track["@attr"]) {
      embed.setAuthor({ name: `${user.username}'s last played track`, iconURL: interaction.user.avatarURL(), url: `https://www.last.fm/user/${user.lastfm}` });
    } else {
        embed.setAuthor({ name: `${user.username}'s currently playing track`, iconURL: interaction.user.avatarURL(), url: `https://www.last.fm/user/${user.lastfm}` });
    }
    embed.addFields([
      { name: "Track", value: track.name, inline: false },
      { name: "Artist", value: track.artist["#text"], inline: false },
      { name: "Album", value: track.album["#text"], inline: false },
    ]);
    interaction.reply({ embeds: [embed] });
  },
};
