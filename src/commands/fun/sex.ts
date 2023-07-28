import { SlashCommandBuilder } from "discord.js";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("sex")
    .setDescription("OMG SEX UPDATE??!1?!"),
  async execute(interaction) {
    const gifs = [
      "https://media.tenor.com/RPNoOOImaRwAAAAC/homer-simpson-homer-dance.gif",
      "https://media.tenor.com/xbVug7Mq0zsAAAAd/sex-sex-meme.gif",
      "https://media.tenor.com/_Qg1xpYDkUYAAAAd/no-sex-sex-meme.gif",
      "https://i.kym-cdn.com/photos/images/original/001/885/623/3f4.gif",
      "https://img1.picmix.com/output/pic/normal/0/3/6/5/6575630_faf48.gif",
      "https://media.tenor.com/spodJqicU9AAAAAC/minecraft-minecraft-sex.gif",
      "https://i.imgur.com/9dAKULk.gif",
    ]
    await interaction.reply(gifs[Math.floor(Math.random() * gifs.length)])
}};
