import {Message, MessageEmbed} from 'discord.js';
import * as https from 'https';
import * as config from '../../../config/config.json'


module.exports = {
	name: 'gi',
	description: 'A basic say command.',
	usage: `img term`,
	aliases: ['image', 'img'],
	argsRequired: true,
	cooldown: 60,
	async run(message: Message, args: string[]) {
		let url = `https://www.googleapis.com/customsearch/v1?key=${config.google.apikey}&cx=${config.google.cx}&safe=high&searchType=image&q=${args.join(' ')}}`

			if (!args[0]) return message.reply('a search term is required.')

		const filter = (reaction, user) => {
			return ['⬅️', '➡️', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
		};


		https.get(url, async function (response) {
			var raw = '';

			response.on('data', function (chunk) {
				raw += chunk;
			});

			response.on('end', async function () {
				let body = JSON.parse(raw);
				if (!body.items) return message.reply("No results found.")
					let size = body.items.length - 1
				const embed = new MessageEmbed()
				.setAuthor(`${message.author.tag} searched for ${args.join(' ')}`)
				.setImage(body.items[0].link)
				.setDescription(`[${body.items[0].title}](${body.items[0].image.contextLink})`)
				let i = 0

				let msgInit = await message.reply({ embed })
				let collector = msgInit.createReactionCollector(filter, { time: 60000, dispose: true })

				msgInit.react('⬅️')
				msgInit.react('➡️');
				msgInit.react('❌').then(() => {
					let size = body.items.length - 1;

					collector.on('collect', reaction => {
						if (reaction.emoji.name === '⬅️' && i > 0) {
							--i;
							let updateEmbed = new MessageEmbed(embed)
							.setImage(body.items[i].link)
							.setDescription(`[${body.items[i].title}](${body.items[i].image.contextLink})`)

							reaction.message.edit(updateEmbed)
						}
						else if (reaction.emoji.name === '➡️' && i < size) {
							++i;
							let updateEmbed = new MessageEmbed(embed)
							.setImage(body.items[i].link)
							.setDescription(`[${body.items[i].title}](${body.items[i].image.contextLink})`)

							reaction.message.edit(updateEmbed)
						}
						else if (reaction.emoji.name === '❌') {
							msgInit.delete();
						}
					})
					collector.on('remove', reaction => {
						if (reaction.emoji.name === '⬅️' && i > 0) {
							--i;
							let updateEmbed = new MessageEmbed(embed)
							.setImage(body.items[i].link)
							.setDescription(`[${body.items[i].title}](${body.items[i].image.contextLink})`)

							reaction.message.edit(updateEmbed)
						}
						else if (reaction.emoji.name === '➡️' && i < size) {
							++i;
							let updateEmbed = new MessageEmbed(embed)
							.setImage(body.items[i].link)
							.setDescription(`[${body.items[i].title}](${body.items[i].image.contextLink})`)

							reaction.message.edit(updateEmbed)
						}
						else if (reaction.emoji.name === '❌') {
							msgInit.delete();
						}
					})
					collector.on('end', collected => {
						if (!msgInit.deleted) msgInit.reactions.removeAll()
					})
				});
			});
			response.on('error', (e) => {
				message.channel.send(`\`${e}\``)
			})
		});
	}
};
