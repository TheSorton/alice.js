import { Message, MessageEmbed } from 'discord.js';
import anilist from 'anilist-node';
import { htmlToMarkdown } from '../../lib/html2md'
const Anilist = new anilist();

module.exports = {
  name: 'character',
  category: 'anime',
  argsRequired: true,
  description: 'Searches AniList for a character',
  usage: '`character <search-term>`',
  async run(message: Message, args: string[]) {
    const query: string = args.join(" ");
     const getId = async (query) => {
        const data = await Anilist.searchEntry.character(query)
        return data.characters
    }
    const idArray = await getId(query);
    const id = idArray[0] != null ? idArray[0].id : null;
  
    if (!id) {
      return message.reply("Not found.");
    }
  
    const data = await Anilist.people.character(id);
    console.log(data)

    const embed = new MessageEmbed()
    if (!data.name.english) {
        embed.setAuthor(`${data.name.native}`,data.image.medium)
    }
    else {
        embed.setAuthor(`${data.name.english} (${data.name.native})`, data.image.medium)
    };
    if (data.description) {
        embed.setDescription(htmlToMarkdown(' >>> ' + data.description.substring(0, 500) + '...'))
    }
        embed.setImage(data.image.large)
        const fields = [
            data.media[0].title.userPreferred && { name: 'Anime', value: data.media[0].title.userPreferred, inline: false }
          ].filter(Boolean);
          
          embed.addFields(fields);
    await message.reply(embed)
  },
};
