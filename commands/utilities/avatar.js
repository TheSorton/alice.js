const { MessageEmbed } = require('discord.js');
const { best_match } = require('../../utils/jaro-winkler')

module.exports = {
    run: async(client, message, args) => {
        const { username, score } = best_match(message, args)

        if (!args[0]) { 
            var embed = new MessageEmbed()
            .setAuthor(`${message.author.username}'s avatar.`, message.author.avatarURL({format: 'png', dynamic: 'true' }))
            .setImage(message.author.avatarURL({format: 'png', dynamic: 'true', size: 2048 }))
            await message.channel.send({ embed: embed})
        }
        else {
            var embed = new MessageEmbed()

            if (message.mentions.users.first()) {
                var gMember = message.guild.member(message.mentions.users.first())
            }
            else {
                var gMember = message.guild.member(message.guild.members.cache.find(user => user.displayName === username))
                embed.setFooter(`The person returned has about a ${Intl.NumberFormat('en-US', { style: 'percent' }).format(score)} chance of being correct.`)
            }
            if (gMember) {
                embed.setAuthor(`${gMember.user.username}'s avatar.`, gMember.user.avatarURL({format: 'png', dynamic: 'true' }))
                embed.setImage(gMember.user.avatarURL({format: 'png', dynamic: 'true', size: 2048 }))
                await message.channel.send({ embed: embed})
            }

            else await message.reply("That user is not found. Try pinging them.")
        }
    },
    name: 'avatar',
    argsReq: false,
    aliases: ['av'],
    description: "Get's a user's avatar.",
    example: "`avatar [user]`"
}