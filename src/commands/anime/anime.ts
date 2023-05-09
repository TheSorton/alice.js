import { Message, MessageEmbed } from 'discord.js';
import anilist from 'anilist-node';
import { htmlToMarkdown } from '../../lib/html2md'
const Anilist = new anilist();

module.exports = {
  name: 'anime',
  category: 'anime',
  argsRequired: true,
  aliases: ['chinese-cartoon'],
  description: 'Searches AniList for an anime',
  usage: '`anime <search-term>`',
  async run(message: Message, args: string[]) {
    const query: string = args.join(" ");
    const getId = async (query: string): Promise<number | null> => {
      const data = await Anilist.searchEntry.anime(query);
      if (data.media.length > 0) {
        return data.media[0].id;
      } 
      else {
        return null;
      }
    };
    const id = await getId(query);
    if (id == null) {
      return message.reply("Not found.");
    }
  
    const data = await Anilist.media.anime(id);
      console.log(data)
    let genres = data.genres.join(", ");
    
    let studio = "";
    for (let i = 0; i < data.studios.length; i++) {
        if (data.studios[i].isAnimationStudio) {
            studio = data.studios[i].name;
            break;
        }
      }
      
      const airDate = (stDay, stMonth, stYr, eDay, eMonth, eYr) => {
        let date = "";
        if (stDay !== null && stMonth !== null && stYr !== null) {
          date += `${stDay}/${stMonth}/${stYr}`;
        }
        if (eDay !== null && eMonth !== null && eYr !== null) {
          date += ` – ${eDay}/${eMonth}/${eYr}`;
        }
      
        return date;
      };

      let rankName
      let ranking = data.rankings.find(ranking => ranking.type === 'POPULAR' && ranking.season != null);
      if (!ranking) {
        ranking = data.rankings.find(ranking => ranking.type === 'POPULAR' && ranking.year != null && ranking.season === null);
        if (!ranking.season) {
          rankName = `(${ranking.year.toString()})`
        } 
        else {
          rankName = `(${ranking.season.toString()} of ${ranking.year.toString()})`
        }
      } 
      else {
        rankName = `(${ranking.season.toString()} of ${ranking.year.toString()})`
      }

    const airdate = airDate(data.startDate.month,data.startDate.day,data.startDate.year,data.endDate.month,data.endDate.day,data.endDate.year)
      
    const embed = new MessageEmbed()

    if (!data.title.english) {
        embed.setAuthor(`${data.title.native}`,data.coverImage.small, data.siteUrl)
    }
    else {
        embed.setAuthor(`${data.title.english} (${data.title.native})`,data.coverImage.small, data.siteUrl)
    };
    if (data.description) {
        embed.setDescription(htmlToMarkdown(' >>> ' + data.description.substring(0, 500) + '...'))
    }
    if (!data.bannerImage) {
      embed.setImage(data.coverImage.large)
    }
    else {
      embed.setImage(data.bannerImage)
    };

  const fields = [
      data.status && { name: 'Status', value: data.status.trim(), inline: true },
      airdate && { name: 'Aired', value: airdate, inline: true },
      ranking && { name: `Popularity ${rankName}`, value: `#${ranking.rank}`, inline: true},
      data.episodes && { name: 'Episodes', value: data.episodes.toString(), inline: true },
      //data.duration && { name: 'Duration/ep', value: `${data.duration} Minutes`, inline: true },
      studio && { name: 'Studio', value: studio.trim(), inline: true },
      data.averageScore && { name: 'Rating', value: data.averageScore.toString(), inline: true },
      //data.favourites && { name: '# of Favorites', value: data.favourites.toString(), inline: true },
      genres && { name: 'Genres', value: genres, inline: false }
    ].filter(Boolean);
    
    embed.addFields(fields);
    await message.reply(embed)

  },
};
