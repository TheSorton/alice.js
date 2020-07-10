const { MessageEmbed } = require('discord.js');
const pkgInfo = require('../../package.json')
const { helpers } = require('../../utils/helpers')

module.exports = {
    run: async(client, message, args) => {
        try {
            var embed = new MessageEmbed()
            .setAuthor(`${client.user.username}'s stats.`, client.user.avatarURL({format: 'png', dynamic: 'true' }))
            .setThumbnail(client.user.avatarURL({format: 'png', dynamic: 'true', size: 2048 }))
            .addFields(
                {name: "Version", value: pkgInfo.version},
                {name: "Node.JS Version", value: process.version},
                {name: "Discord.JS Version", value: pkgInfo.dependencies["discord.js"].replace('^', 'v'), inline: false},
                {name: "Uptime", value: helpers.format(process.uptime())}
            )
            await message.channel.send({ embed: embed})
        }
        catch (error) {
            await message.channel.send(`\`${error}\`\n You shouldn't see this. Contact alan ✨#1989`)
        }
    },
    name: 'botinfo',
    category: 'utilities',
    argsReq: false,
    aliases: ['botstats'],
    description: "Get's the bot's stats."
}