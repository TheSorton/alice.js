// Google Images
const tiny = require('tiny-json-http')
const config = require('../../config/config.json');
const { MessageEmbed } = require('discord.js');
const { track_message, is_message_tracked, MessageType }
    = require('../../utils/reaction_tracking.js').reaction_tracking;

module.exports = {
    run: async(client, message, args) => {
        try {

            const filter = (reaction, user) => {
                return ['⬅️', '➡️',  '❌' ].includes(reaction.emoji.name) && user.id === message.author.id;

            };
            collector = message.createReactionCollector(filter, { time: 60000 });

            let url = `https://www.googleapis.com/customsearch/v1?key=${config.google.apikey}&cx=${config.google.cx}&safe=high&searchType=image&q=${args.join(' ')}}`
            tiny.get({url}, function _get(err, response) {
                if (err) {
                    console.log(err)
                }
                else {
                    embedID = null
                    var body =  response.body;
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
                }})}
        catch (error) {
            await message.channel.send(`\`${error}\`\n You shouldn't see this. Contact alan ✨#1989`)
        }

    },
    name: 'image',
    category: 'google',
    args: true,
    aliases: ['google', 'img'],
    description: 'Searches Google for images',
    usage: '`image <search-term>`'
}
