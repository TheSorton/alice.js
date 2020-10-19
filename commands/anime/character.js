const { clean_everyone, clean_here } = require("../../utils/sanitize.js").sanitize;
const bent = require('bent');
const { MessageEmbed } = require("discord.js");
const getJSON = bent('json');

module.exports = {
    run: async(client, message, args) => {

        const cleanCharAbout = (about) => {
            let n = about.indexOf("\\n")
            let cleanAbout = about.substring(0, n)
            return cleanAbout;

        }

	    let search = await getJSON(`https://api.jikan.moe/v3/search/character?q=${args.join(" ")}&page=1`)
        let characterID = search.results[0].mal_id

        let character = await getJSON(`https://api.jikan.moe/v3/character/${characterID}`)
        let anime = character.animeography.map(x => x.name).join(" | ")
        let manga = character.mangaography.map(x => x.name).join(" | ")
        let voiceActors = character.voice_actors.map(x => x.name).join(" | ")
        
        const embed = new MessageEmbed()
            .setAuthor(`${character.name}`, character.image_url, character.url)
            .setDescription(cleanCharAbout(character.about))
            .setImage(character.image_url)
            .addFields(
                { name: 'Nicknames', value: character.nicknames.join(", ") || "None" },
                { name: 'Animeography', value: anime.substring(0, 350) + '...' || "Not found" }, 
                { name: 'Mangaography', value: manga.substring(0, 350) + '...' || "Not found" },
                { name: 'VAs', value: voiceActors || "Not rated" },
                { name: 'MAL Favorites', value: character.member_favorites || "Not found", inline: true },
            )
            .setFooter("Information provided by MyAnimeList", 'https://upload.wikimedia.org/wikipedia/commons/7/7a/MyAnimeList_Logo.png')

        await message.channel.send(embed)
    },
    name: 'character',
    category: 'anime',
    args: true,
    aliases: ['char'],
    description: 'Searchs for a character',
    usage: '`character <search-term>`'
}
