const { MessageEmbed } = require('discord.js');
const { jaro_winkler } = require('../../utils/jaro-winkler')

module.exports = {
    run: async(client, message, args) => {

        const gMember = message.guild.member(
        message.mentions.users.first() ||
        message.guild.members.cache.find(user => user.displayName === jaro_winkler(message, args)))
        
        if (gMember) {
        var embed = new MessageEmbed()
        .setAuthor(`${gMember.user.username}'s avatar.`, gMember.user.avatarURL({format: 'png', dynamic: 'true' }))
        .setImage(gMember.user.avatarURL({format: 'png', dynamic: 'true', size: 2048 }))
        await message.channel.send({ embed: embed})
        }

        else await message.reply("That user is not found. Try pinging them.")
    },
    name: 'avatar',
    args: true,
    aliases: ['av'],
    description: "Get's a user's avatar.",
    example: "`avatar [user]`"
}