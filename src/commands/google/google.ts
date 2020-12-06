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
    if (!args[0]) return message.reply('a search term is required.')

    let url = `https://www.googleapis.com/customsearch/v1?key=${config.google.apikey}&cx=${config.google.cx}&safe=high&q=${args.join(' ')}}`

    https.get(url, function (response) {
      var raw = '';

      response.on('data', function (chunk) {
        raw += chunk;
      });

      response.on('end', function () {
        var body = JSON.parse(raw);
        console.log(body)
        if (!body.items) return message.reply("No results found.")
        let size = body.items.length - 1
        const embed = new MessageEmbed()
          .setAuthor(`${message.author.tag} searched for ${args.join(' ')}`)

        let description = '';
        body.items.slice(0, 5).forEach(result => description += `**[${result.title}](${result.formattedUrl})**\n${result.snippet}\n\n`) 
        embed.setDescription(description)

        message.channel.send({ embed })
      });
    });
  }
};
