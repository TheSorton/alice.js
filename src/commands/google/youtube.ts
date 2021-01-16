import { Message, MessageEmbed } from 'discord.js';
import * as https from 'https';
import * as config from '../../../config/config.json'

module.exports = {
  name: 'yt',
  description: 'Search YouTube.',
  aliases: ['youtube'],
  usage: `yt term`,
  argsRequired: true,
  cooldown: 60,
  run(message: Message, args: string[]) {
    if (!args[0]) return message.reply('a search term is required.')
    const filter = (reaction, user) => {
			return ['⬅️', '➡️', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
		};

    let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&order=relevance&type=video&videoDefinition=high&key=${config.google.apikey}&q=${args.join(' ')}`
    
    https.get(url, async function (response) {
      var raw = '';

      response.on('data', function (chunk) {
        raw += chunk;
      });

      response.on('end', async function () {
				let body = JSON.parse(raw);
				if (!body.items) return message.reply("No results found.")
        let size = body.items.length - 1
        let i = 0

        let link = `https://youtu.be/${body.items[i].id.videoId}`

				let msgInit = await message.reply(link)
				let collector = msgInit.createReactionCollector(filter, { time: 60000, dispose: true })

				msgInit.react('⬅️')
				msgInit.react('➡️');
				msgInit.react('❌').then(() => {
					let size = body.items.length - 1;

					collector.on('collect', reaction => {
            if (reaction.emoji.name === '⬅️' && i > 0) {
              --i;
              reaction.message.edit(`https://youtu.be/${body.items[i].id.videoId}`)
            }
            else if (reaction.emoji.name === '➡️' && i < size) {
              ++i;
              reaction.message.edit(`https://youtu.be/${body.items[i].id.videoId}`)

            }
            else if (reaction.emoji.name === '❌') {
              msgInit.delete();
            }
          });
          collector.on('remove', reaction => {
            if (reaction.emoji.name === '⬅️' &&  i > 0) {
              --i;
              reaction.message.edit(`https://youtu.be/${body.items[i].id.videoId}`)

            }
            else if (reaction.emoji.name === '➡️' && i < size) {
              ++i;
              reaction.message.edit(`https://youtu.be/${body.items[i].id.videoId}`)
            }
            else if (reaction.emoji.name === '❌') {
              msgInit.delete();
            }
          });
          collector.on('end', collected => {
            if(!msgInit.deleted) msgInit.reactions.removeAll()
          });
				});
			});
    });
  }
};
