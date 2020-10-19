const { cleanEveryone, cleanHere } = require("../../utils/sanitize.js").sanitize;
const bent = require('bent');
const { MessageEmbed } = require("discord.js");
const getJSON = bent('json');

module.exports = {
    run: async(client, message, args) => {
	    let search = await getJSON(`https://api.jikan.moe/v3/search/manga?q=${args.join(" ")}&page=1`)
        let mangaID = search.results[0].mal_id

        let manga = await getJSON(`https://api.jikan.moe/v3/manga/${mangaID}`)
        let genres = manga.genres.map(a => a.name).join(", ");
        
        const embed = new MessageEmbed()
            .setAuthor(`${manga.title})`, manga.image_url, manga.url)
            .setDescription(manga.synopsis.substring(0, 350) + '...')
            .setImage(manga.image_url)
            .addFields(
                { name: 'Published', value: manga.published.string || "Not found", inline: true},
                { name: 'Volumes', value: manga.volumes || "Not found", inline: true}, 
                { name: 'Chapters', value: manga.chapters || "Not found", inline: true },
                { name: 'Rating', value: manga.rating || "Not rated", inline: true },
                { name: 'Score', value: manga.score || "Not found", inline: true },
                { name: 'MAL Rank', value: manga.rank || "Not found", inline: true },
                { name: 'Genres', value: genres || "Not found"}
            )
            .setFooter("Information provided by MyAnimeList", 'https://upload.wikimedia.org/wikipedia/commons/7/7a/MyAnimeList_Logo.png')

        await message.channel.send(embed)
    },
    name: 'manga',
    category: 'anime',
    args: true,
    aliases: ['chinese-comics'],
    description: 'Searchs for a manga',
    usage: '`manga <search-term>`'
}
