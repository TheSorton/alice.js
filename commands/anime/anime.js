const { clean_everyone, clean_here } = require("../../utils/sanitize.js").sanitize;
const bent = require('bent');
const { MessageEmbed } = require("discord.js");
module.exports = {
    run: async(client, message, args) => {
        const getJSON = bent('json')
	    let search = await getJSON(`https://api.jikan.moe/v3/search/anime?q=${args.join(" ")}&page=1`)
        let animeID = search.results[0].mal_id

        let anime = await getJSON(`https://api.jikan.moe/v3/anime/${animeID}`)
        let genres = anime.genres.map(a => a.name).join(", ");
        
        const embed = new MessageEmbed()
            .setAuthor(`${anime.title_english} (${anime.title_japanese})`, anime.image_url, anime.url)
            .setDescription(anime.synopsis.substring(0, 350) + '...')
            .setImage(anime.image_url)
            .addFields(
                { name: 'Aired', value: anime.aired.string, inline: true},
                { name: 'Episodes', value: anime.episodes, inline: true}, 
                { name: 'Duration/ep', value: anime.duration, inline: true },
                { name: 'Rating', value: anime.rating, inline: true },
                { name: 'Score', value: anime.score, inline: true },
                { name: 'MAL Rank', value: anime.rank, inline: true },
                { name: 'Genres', value: genres}
            )
            .setFooter("Information from MyAnimeList", 'https://upload.wikimedia.org/wikipedia/commons/7/7a/MyAnimeList_Logo.png')

        await message.channel.send(embed)
    },
    name: 'anime',
    category: 'anime',
    args: true,
    aliases: ['chinese-cartoon'],
    description: 'Searches MAL for an anime',
    usage: '`anime <search-term>`'
}
