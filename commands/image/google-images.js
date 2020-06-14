const { Command } = require('discord.js-commando');
const discord = require('discord.js');
const config = require('../../config.json')
var request = require('request');



module.exports = class GImages extends Command {
    constructor(client) {
		super(client, {
			name: 'image',
			aliases: ['googeimages'],
			group: 'image',
			memberName: 'image',
            description: "Searches google for an image.",
            args: [
                {
                    type:"string",
                    label: "search term",
                    prompt:"",
                    key:"string",
                }],
                argsPromptLimit: 0
		});
    }
    run(message, {string}) {
        // Make the request
        request(`https://www.googleapis.com/customsearch/v1?key=${config['Google']['API Key']}&cx=${config['Google']['Google CX']}&safe=high&searchType=image&q=${string}`
                , function (error, response, body) {
            var body = JSON.parse(body)
            // No results found
            if (body['searchInformation']['totalResults'] === "0") { message.reply("No results found") }

            const imageEmbed = new discord.MessageEmbed()
            .setAuthor(`${message.author.tag} searched for "${string}"`, message.author.avatarURL({Type: 'png'}))
            .setDescription(`[${body['items'][0]['title']}](${body['items'][0]['image']['contextLink']})`)
            .setImage(body['items'][0]['link'])
            .setFooter(`This query took ${body['searchInformation']['searchTime']} seconds. | There were ${body['searchInformation']['totalResults']} results.`)
            message.say({embed: imageEmbed})
        })}
}