const http = require('http')
const config = require('../../config/config.json')
var fs = require('fs');
const { createCollage } = require('@mtblc/image-collage');
const lastFMModel = require("../../database/models/lastfm");
const { MessageEmbed, MessageAttachment } = require('discord.js');

module.exports = {
    run: async(client, message, args) => {


        const urlBuilder = (username, timespan) => {
            let url = `http://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${username}&period=${timespan}&api_key=${config.lastfm.apikey}&format=json`
            return url;
        }

        const genCollage = (images, username) => {
            const collageWidth = 1000;
            createCollage(images, collageWidth).then((imageBuffer) => {
                fs.writeFileSync("out.png", imageBuffer);

                const file = new MessageAttachment('out.png');

                const embed = new MessageEmbed()
                .setAuthor(username, message.author.avatarURL({type: 'png'}))
                .setColor('RANDOM')
                .setImage('attachment://out.png')

                message.channel.send({files: [file], embed: embed})
              });
            
        }

        const getAlbums = (builtURL, username) => {
            message.channel.startTyping();

            http.get(builtURL, async function(response) {
                var body = '';
                response.on('data', function(chunk) {
                body += chunk;
                });
    
                response.on('end', async function() {
                    covers = [];
                    let n = 0
                    while (n < 9) {
                        if (!JSON.parse(body).topalbums.album[n].image[3]['#text']) {
                            covers.push('https://live.staticflickr.com/3804/8788210204_4b9b45becb.jpg')
                            n++;    
                        }
                        else {
                            covers.push(JSON.parse(body).topalbums.album[n].image[3]['#text']);
                            n++;
    
                        }
                    }
                    genCollage(covers, username)
                    message.channel.stopTyping();

                })
    
            }).on('error', (e) => {
            message.channel.send(`\`${e}\``)
            })
        }


        const checkDB = async (message) => {
            if (doc = await lastFMModel.findOne({ userID: message.author.id })) {
                return doc;
            }
            else {
                await message.reply("Set your username using `fm set [username]` without the brackets.")
                return
            }
        }

        if (message.mentions.users.first()) {
            doc = await lastFMModel
            .findOne({ userID: message.mentions.users.first().id })
            .catch(err => console.log(err));

            if (!doc) return await message.reply("that user hasn't set their username.")

            var username = doc.username
        }


        else if (args[0]) {
            switch (args[0]) {
                case '7day':
                    var doc = await checkDB(message)
                    var username = doc.username
                    timespan = args[0]
                    getAlbums(urlBuilder(username, timespan), username)
                    break;
                case '1month':
                    var doc = await checkDB(message)
                    var username = doc.username
                    timespan = args[0]
                    getAlbums(urlBuilder(username, timespan), username)
                    message.channel.send(embed);
                    break;

                case '3month':
                    var doc = await checkDB(message)
                    var username = doc.username
                    timespan = args[0]
                    size = args[1] || '3'
                    getAlbums(urlBuilder(username, timespan), username)
                    message.channel.send(embed);
                    break;

                case '6month':
                    var doc = await checkDB(message)
                    var username = doc.username
                    timespan = args[0]
                    getAlbums(urlBuilder(username, timespan), username)
                    message.channel.send(embed);
                    break;

                case 'overall':
                    var doc = await checkDB(message)    
                    var username = doc.username
                    timespan = args[0]
                    getAlbums(urlBuilder(username, timespan), username)
                    break;

                default: 
                    var username = args[0]
                    timespan = args[1] || '7day'
                    getAlbums(urlBuilder(username, timespan), username)
                    break;

            }
        }
        else if (!args[0]) {
            if (doc = await lastFMModel.findOne({ userID: message.author.id })) {
                var username = doc.username
                timespan = '7day'
                getAlbums(urlBuilder(username, timespan), username)
            }
            else {
                await message.reply("Set your username using `fm set [username]` without the brackets.")
                return
            }

        }

    },
    name: 'fmc',
    category: 'last.fm',
    args: true,
    aliases: ['collage'],
    usage: '`fmc [username] [timeframe] (timeframes are: 7day, 1month, 3month, 6month, and overall)`',
    description: 'Gets last.fm album collage'
    }
