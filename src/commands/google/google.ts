import { Message, MessageEmbed } from 'discord.js';
import * as https from 'https';
import * as config from '../../../config/config.json'

module.exports = {
  name: 'g',
  description: 'Search Google.',
  aliases: ['google'],
  usage: `google term`,
  argsRequired: true,
  cooldown: 60,
  run(message: Message, args: string[]) {
    let url = `https://www.googleapis.com/customsearch/v1?key=${config.google.apikey}&cx=${config.google.cx}&safe=high&q=${args.join(' ')}}`

    https.get(url, function (response) {
      var raw = '';

      response.on('data', function (chunk) {
        raw += chunk;
      });

      response.on('end', function () {
        let body = JSON.parse(raw);
        if (!body.items) return message.reply("No results found.")
        const embed = new MessageEmbed()
          .setAuthor(`${message.author.tag} searched for ${args.join(' ')}`)

        let description: string = '';
        body.items.slice(0, 5).forEach(result => description += `**[${result.title}](${result.formattedUrl})**\n${result.snippet}\n*${result.displayLink}*\n\n`) 
        embed.setDescription(description)
        message.reply({ embed })
      });
    }); 
  }
};
