const { helpers } = require('../../utils/helpers')
const { MessageEmbed } = require("discord.js")

module.exports = {
    run: async(client, message, args) => {
        try {
            roleArray = [];
            message.guild.roles.cache.keyArray().forEach(x => {
                roleArray.push(message.guild.roles.resolve(x))
                roleArray.sort(helpers.sortArrayBy('rawPosition', true, parseInt))
                if (roleArray.length > 15) {
                    roles = `${roleArray.slice(0, 15).join(' ')} ...`
                }
                else {
                    roles = roleArray.join(' ')
                }
            })

            const embed = new MessageEmbed()
            .setAuthor(`${message.guild.name}'s information`)
            .setThumbnail(message.guild.iconURL({format: 'png', dynamic: true}))
            .addFields(
                { name: 'Server ID', value: message.guild.id, inline: true },
                { name: 'Owner', value: `<@${message.guild.ownerID}>`, inline: true},
                { name: 'Created on', value: message.guild.createdAt, inline: false},
                { name: 'Partnered?_ _', value: message.guild.partnered, inline: true},
                { name: 'Boost level_ _', value: message.guild.premiumTier, inline: true },
                { name: '# of boosters', value: message.guild.premiumSubscriptionCount, inline: true },
                { name: '# of members', value: message.guild.memberCount, inline: true},
                { name: `Roles [${message.guild.roles.cache.keyArray().length}]`, value: roles }

            )
            if (message.guild.banner) {
            embed.setImage(message.guild.bannerURL({format: 'png', size: 2048}))
            }
            await message.channel.send(embed)

        }
        catch (error) {
            await message.channel.send(`\`${error}\``)
        }
    },
    name: 'serverinfo',
    category: 'utilities',
    args: false,
    aliases: ['guild', 'server'],
    description: "Displays the server's information"
}