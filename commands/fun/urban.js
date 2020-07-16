var http = require("https");
const { MessageEmbed } = require("discord.js");

module.exports = {
    run: async(client, message, args) => {
        try {
            const filter = (reaction, user) => {
                return ['⬅️', '➡️',  '❌' ].includes(reaction.emoji.name) && user.id === message.author.id;
            };

            var icon = 'https://i.pinimg.com/originals/04/83/c7/0483c76e02e484dbf20009418758849e.jpg'

            if (!args[0]) return await message.reply('what did you want me to say?')
            var args = args.join(' ')
            var options = {
                "method": "GET",
                "hostname": "mashape-community-urban-dictionary.p.rapidapi.com",
                "port": null,
                "path": `/define?term=${encodeURIComponent(args)}`,
                "headers": {
                    "x-rapidapi-host": "mashape-community-urban-dictionary.p.rapidapi.com",
                    "x-rapidapi-key": "92eab16bcemsh058778673449cfcp1629c6jsn19b03b135965",
                    "useQueryString": true
                }
            };
            
            var req = http.request(options, function (res) {
                var chunks = [];
            
                res.on("data", function (chunk) {
                    chunks.push(chunk);
                });
            
                res.on("end", function () {
                    i=0
                    var body = JSON.parse(Buffer.concat(chunks));
                    if (!body.list[0]) return message.reply('word not found.')
                    const embed = new MessageEmbed()
                    .setAuthor(body.list[0].word, icon, body.list[0].permalink)
                    .setDescription(body.list[0].definition + '\n\n' + '**Example**\n' + body.list[0].example )
                    .setFooter(`Author: ${body.list[i].author}`)

                    message.channel.send({ embed }).then(
                        msg => msg.react('⬅️').then(
                            msg.react('➡️').then(
                            msg.react('❌').then(
                    
                    msg.createReactionCollector(filter, { time: 60000, dispose: true })
                    .on('collect', reaction => {
                        if (reaction.emoji.name === '⬅️' && i > 0) {
                            --i;
                            updateEmbed = new MessageEmbed(embed)
                            .setAuthor(body.list[i].word, icon, body.list[i].permalink)
                            .setDescription(body.list[i].definition + '\n\n' + '**Example**\n' + body.list[i].example )
                            .setFooter(`Author: ${body.list[i].author}`)

                            reaction.message.edit(updateEmbed)
                        }
                        else if (reaction.emoji.name === '➡️' && i < 9) {
                            ++i;
                            updateEmbed = new MessageEmbed(embed)
                            .setAuthor(body.list[i].word, icon, body.list[i].permalink)
                            .setDescription(body.list[i].definition + '\n\n' + '**Example**\n' + body.list[i].example )
                            .setFooter(`Author: ${body.list[i].author}`)

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
                            .setAuthor(body.list[i].word, icon, body.list[i].permalink)
                            .setDescription(body.list[i].definition + '\n\n' + '**Example**\n' + body.list[i].example )
                            .setFooter(`Author: ${body.list[i].author}`)

                            reaction.message.edit(updateEmbed)
                        }
                        else if (reaction.emoji.name === '➡️' && i < 9) {
                            ++i;
                            updateEmbed = new MessageEmbed(embed)
                            .setAuthor(body.list[i].word, icon, body.list[i].permalink)
                            .setDescription(body.list[i].definition + '\n\n' + '**Example**\n' + body.list[i].example )
                            .setFooter(`Author: ${body.list[i].author}`)

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
                message.channel.send(`\`${e}\`\n You shouldn't see this. Contact alan ✨#1989.`)
            });
            
            req.end();
        }
        catch (error) {
            await message.channel.send(`\`${error}\`\n You shouldn't see this. Contact alan ✨#1989`)
        }
    },
    name: 'urban',
    category: 'fun',
    args: true,
    description: 'Searches Urban Dictionary',
    usage: '`urban <term>`'
}


