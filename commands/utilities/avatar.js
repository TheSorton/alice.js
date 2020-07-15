const { MessageEmbed } = require('discord.js');
const { best_match } = require('../../utils/findUser')

module.exports = {
    run: async(client, message, args) => {
        try {
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
                }
                if (gMember) {
                    embed.setAuthor(`${gMember.user.username}'s avatar.`, gMember.user.avatarURL({format: 'png', dynamic: 'true' }))
                    embed.setImage(gMember.user.avatarURL({format: 'png', dynamic: 'true', size: 2048 }))
                    await message.channel.send({ embed: embed})
                }

                else await message.reply("That user is not found. Try pinging them.")
            }
        }
        catch (error) {
            await message.channel.send(`\`${error}\`\n You shouldn't see this. Contact alan ✨#1989`)
        }
    },
    name: 'avatar',
    category: 'utilities',
    argsReq: false,
    aliases: ['av'],
    description: "Get's a user's avatar.",
    usage: "`avatar [user]`"
}