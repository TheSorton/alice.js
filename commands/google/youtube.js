// Google Images
const https = require('https')
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

            let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&order=relevance&type=video&videoDefinition=high&key=${config.google.apikey}&q=${args.join(' ')}`
            https.get(url, function(response) {
                var body = '';

                response.on('data', function(chunk){
                    body += chunk;
                });
                response.on('end', function() {
                    body = JSON.parse(body);
                    if (!body.items)  return message.reply("No results found.")
                    let link = `https://youtu.be/${body.items[0].id.videoId}`
                    i = 0

                    message.channel.send(link).then(
                        msg => msg.react('⬅️').then(
                            msg.react('➡️').then(
                            msg.react('❌').then(
                    msg.createReactionCollector(filter, { time: 60000, dispose: true })
                    .on('collect', reaction => {
                        if (reaction.emoji.name === '⬅️' && 4 >= i > 0) {
                            --i;
                            reaction.message.edit(`https://youtu.be/${body.items[i].id.videoId}`)
                        }
                        else if (reaction.emoji.name === '➡️' && i <= 4) {
                            ++i;
                            if (i === 5) return
                            reaction.message.edit(`https://youtu.be/${body.items[i].id.videoId}`)

                        }
                        else if (reaction.emoji.name === '❌') {
                            msg.delete();
                        }
                    })
                    .on('remove', reaction => {
                        if (reaction.emoji.name === '⬅️' && 4 >= i > 0) {
                            --i;
                            reaction.message.edit(`https://youtu.be/${body.items[i].id.videoId}`)

                        }
                        else if (reaction.emoji.name === '➡️' && i < 5) {
                            ++i;
                            if (i === 5) return
                            reaction.message.edit(`https://youtu.be/${body.items[i].id.videoId}`)
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
                message.channel.send(`\`${e}\`\n You shouldn't see this. Contact alan ✨#1989.`)
            })
        }
        catch (error) {
            await message.channel.send(`\`${error}\`\n You shouldn't see this. Contact alan ✨#1989`)
        }

    },
    name: 'yt',
    category: 'google',
    args: true,
    aliases: ['youtube'],
    description: 'Searches youtube',
    usage: '`yt <search-term>`'
}
