const { Command } = require('discord.js-commando');
const discord = require('discord.js');
var request = require('request');



module.exports = class Pape extends Command {
    constructor(client) {
		super(client, {
			name: 'pape',
			aliases: ['wp', 'wallpaper', 'wallhaven'],
			group: 'image',
			memberName: 'pape',
            description: "Searches Wallhaven for a wallpaper. No search term returns a random wallpaper.",
            args: [
                {
                    type:"string",
                    label: "search term",
                    prompt:"",
                    key:"string",
                    default: "" // Just here so commando doesn't spit an error at the user should they not inclue a search term
                }],
                argsPromptLimit: 0
		});
    }
    run(message, {string}) {
        // If no string is given, use nothing for a random result
        if (!string) { var string = ""}            
        // Make the request
        request(`https://wallhaven.cc/api/v1/search?q=${string}&sorting=random`, function (error, response, body) {
            var body = JSON.parse(body)
            // If this the 0 index is undefined, nothing was found
            if (!body['data'][0]) { message.reply("No results found"); return;}


            // Create and send the embed
            const papeEmbed = new discord.MessageEmbed()
            .setColor(body['data'][0]['colors'][0]) // Wallhaven is neat in that it tries to get colors that can be used for the embed color
            .setImage(body['data'][0]['path'])
            if (string === "") {
                papeEmbed.setAuthor(`${message.author.tag} searched for nothing.`, message.author.avatarURL({type: 'png'}), body['data'][0]['url'])

            }
            else {
                papeEmbed.setAuthor(`${message.author.tag} searched for "${string}".`, message.author.avatarURL({type: 'png'}), body['data'][0]['url'])
            };
            
            message.say({embed: papeEmbed})
          });
    }}
