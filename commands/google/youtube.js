// Google Images
const tiny = require('tiny-json-http')
const config = require('../../config/config.json');
const { MessageEmbed } = require('discord.js');
const { track_message, is_message_tracked, MessageType }
    = require('../../utils/reaction_tracking.js').reaction_tracking;

module.exports = {
    run: async(client, message, args) => {

        let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&order=relevance&type=video&videoDefinition=high&key=${config.google.apikey}&q=${args.join(' ')}`
        tiny.get({url}, function _get(err, response) {
            if (err) {
                console.log(err)
            }
            else {
                embedID = null
                var body =  response.body;
                if (!body.items)  return message.reply("No results found.")
                link = `https://youtu.be/${body.items[0].id.videoId}`

                message.channel.send(link).then(
                    msg => msg.react('⬅️').then(
                           msg.react('➡️').then(
                           msg.react('❌').then(track_message(MessageType.YouTube, msg)))));

                i = 0
                client.on('messageReactionAdd', async (reaction, user) => {
                    if (user.bot) return;
                    if (is_message_tracked(MessageType.YouTube, reaction.message)) {
                        if (user.id === message.author.id)  {
                            if (reaction._emoji.name === '➡️') {
                                i = i + 1;

                                link = `https://youtu.be/${body.items[i].id.videoId}`

                                await reaction.message.edit(link)
                            }
                            else if (reaction._emoji.name === '⬅️' && i > 0) {
                                --i;

                                link = `https://youtu.be/${body.items[i].id.videoId}`

                                await reaction.message.edit(link)
                            }
                            else if (reaction._emoji.name === '❌') {
                                await reaction.message.delete()
                            }
                        }
                    }
                })

                client.on('messageReactionRemove', async (reaction, user) => {
                    if (user.bot) return;
                    if (is_message_tracked(MessageType.YouTube, reaction.message)) {
                        if (user.id === message.author.id)  {
                            if (reaction._emoji.name === '➡️') {
                                i = i + 1;

                                link = `https://youtu.be/${body.items[i].id.videoId}`

                                await reaction.message.edit(link)
                            }
                            else if (reaction._emoji.name === '⬅️' && i > 0) {
                                --i;
                                link = `https://youtu.be/${body.items[i].id.videoId}`

                                await reaction.message.edit(link)
                            }
                            else if (reaction._emoji.name === '❌') {
                                await reaction.message.delete()
                            }
                        }
                    }
                })
            }
        });
    },
    name: 'yt',
    category: 'google',
    args: true,
    aliases: ['youtube'],
    description: 'Searches youtube',
    usage: '`yt <search-term>`'
}
