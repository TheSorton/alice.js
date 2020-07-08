const tiny = require('tiny-json-http')
const config = require('../../config/config.json')

const mongoose = require('mongoose')
const lastFMModel = require("../../database/models/lastfm");
const { DiscordAPIError, MessageEmbed } = require('discord.js');

module.exports = {
    run: async(client, message, args) => {

        if (args[0] === 'set') {
            let doc = await lastFMModel
            .findOne({ userID: message.author.id })
            .catch(err => console.log(err));
            if (doc) {
                if (doc = await lastFMModel.findOne({ userID: message.author.id })) {
                    doc.username = args[1]
                    await doc.save();
                    await message.channel.send('Your username has been updated.')
                    return;
                }
            }
            else {
                let dbFMModel = new lastFMModel({
                    userID: message.author.id,
                    username: args[1]
                });

                dbFMModel.save()
                        .catch(err => console.log(err))

                await message.channel.send("Your username has been set.")
                return;
            }
        }
        else {
            if (args[0]) var username = args[0]
            else if (doc = await lastFMModel.findOne({ userID: message.author.id })) var username = doc.username
            else {
                await message.reply("Set your username using `fm set [username]` without the brackets.")
                return
            }
        }

        let url = `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${config.lastfm.apikey}&format=json`

        tiny.get({url}, function _get(err, response) {
            if (err) {
                console.log(err)
            }
            else {
                var body =  response.body;
                if (!body.recenttracks.track[0]) return message.reply("No scrobbles.")
                if (body.recenttracks.track[0]['@attr']) { 
                    var nowPlaying = true
                }
                else { 
                    var nowPlaying = false
                }

                const embed = new MessageEmbed()
                .addFields(
                    { name: 'Artist', value: body.recenttracks.track[0].artist['#text'], inline: true},
                    { name: 'Title', value: body.recenttracks.track[0].name, inline: true}
                )
                .setThumbnail(body.recenttracks.track[0].image[3]['#text'])

                if (nowPlaying) embed.setAuthor(`${body.recenttracks['@attr'].user} • Now playing`, message.author.avatarURL({type: 'png', dynamic: true}), `https://last.fm/user/${username}`)
                else embed.setAuthor(`${body.recenttracks['@attr'].user} • Last played`, message.author.avatarURL({type: 'png', dynamic: true}), `https://last.fm/user/${username}`)

                message.channel.send({embed: embed})
            }
        });

    },
    name: 'fm',
    category: 'lastfm',
    args: true,
    aliases: ['np'],
    usage: '`fm [set] [username]`',
    description: 'Gets last.fm now playing'
}
