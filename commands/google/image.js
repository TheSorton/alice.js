// Google Images
const https = require('https')
const config = require('../../config/config.json');
const { MessageEmbed } = require('discord.js');
const { track_message, is_message_tracked, MessageType }
    = require('../../utils/reaction_tracking.js').reaction_tracking;

module.exports = {
    run: async(client, message, args) => {
        try {
            if (!args[0]) return await message.reply('a search term is required.')
            const filter = (reaction, user) => {
                return ['⬅️', '➡️',  '❌' ].includes(reaction.emoji.name) && user.id === message.author.id;

            };
            collector = message.createReactionCollector(filter, { time: 60000 });

            let url = `https://www.googleapis.com/customsearch/v1?key=${config.google.apikey}&cx=${config.google.cx}&safe=high&searchType=image&q=${args.join(' ')}}`
            https.get(url, function(response) {
                var body = '';

                response.on('data', function(chunk) {
                    body += chunk;
                });
            
                response.on('end', function() {
                    body = JSON.parse(body);
                    if (!body.items)  return message.reply("No results found.")
                    const embed = new MessageEmbed()
                    .setAuthor(`${message.author.tag} searched for ${args.join(' ')}`)
                    .setImage(body.items[0].link)
                    .setDescription(`[${body.items[0].title}](${body.items[0].image.contextLink})`)
                    i=0

                    message.channel.send({ embed }).then(
                        msg => msg.react('⬅️').then(
                            msg.react('➡️').then(
                            msg.react('❌').then(

                    msg.createReactionCollector(filter, { time: 60000, dispose: true })
                    .on('collect', reaction => {
                        if (reaction.emoji.name === '⬅️' && i > 0) {
                            --i;
                            updateEmbed = new MessageEmbed(embed)
                            .setImage(body.items[i].link)
                            .setDescription(`[${body.items[i].title}](${body.items[i].image.contextLink})`)

                            reaction.message.edit(updateEmbed)
                        }
                        else if (reaction.emoji.name === '➡️') {
                            ++i;
                            updateEmbed = new MessageEmbed(embed)
                            .setImage(body.items[i].link)
                            .setDescription(`[${body.items[i].title}](${body.items[i].image.contextLink})`)

                            reaction.message.edit(updateEmbed)
                        }
                        else if (reaction.emoji.name === '❌') {
                            msg.delete();
                        }
                    })
                    .on('remove', reaction => {
                        if (reaction.emoji.name === '⬅️' && i > 0) {
                            --i;
                            updateEmbed = new MessageEmbed(embed)
                            .setImage(body.items[i].link)
                            .setDescription(`[${body.items[i].title}](${body.items[i].image.contextLink})`)

                            reaction.message.edit(updateEmbed)
                        }
                        else if (reaction.emoji.name === '➡️') {
                            ++i;
                            updateEmbed = new MessageEmbed(embed)
                            .setImage(body.items[i].link)
                            .setDescription(`[${body.items[i].title}](${body.items[i].image.contextLink})`)

                            reaction.message.edit(updateEmbed)
                        }
                        else if (reaction.emoji.name === '❌') {
                            msg.delete();
                        }
                    })
                    .on('end', collected => {
                        msg.reactions.removeAll()
                    })
                    ))))
                })
            }).on('error', (e) => {
                message.channel.send(`\`${e}\``)
            })
        }
        catch (error) {
            await message.channel.send(`\`${error}\``)
        }

    },
    name: 'image',
    category: 'google',
    args: true,
    aliases: ['google', 'img'],
    description: 'Searches Google for images',
    usage: '`image <search-term>`'
}
