const { best_match } = require('../../utils/findUser');
const { MessageEmbed } = require('discord.js');

module.exports = {
    run: async(client, message, args) => {
        try {

            if (!args[0]) {
                let username = await message.author.fetch().then(x => { return x.username})
                var gMember = await message.guild.member(message.guild.members.cache.find(user => user.user.username === username))
                var user = gMember.user
            }
            else if (message.mentions.users.first()) {
                var gMember = await message.guild.member(message.mentions.users.first())
                var user = gMember.user
            }
            else {
                var { username, score } = best_match(message, args)
                var gMember = await message.guild.member(message.guild.members.cache.find(user => user.displayName === username))
                var user = gMember.user
            }
            
            const { _roles } = gMember
            const { name } = gMember.roles.cache

            if (user.presence.activities[0]) { 
                if (user.presence.activities[0].state) { 
                    if (user.presence.activities[0].name === 'Spotify') {
                        var fieldNameStatus = 'Spotify'
                        var status = `**${user.presence.activities[0].details}** by **${user.presence.activities[0].state}**`
                    }
                    else {
                        var fieldNameStatus = 'Custom Status'
                        var status = user.presence.activities[0].state 
                    }}
                
                else {
                    var fieldNameStatus = 'Activity' 
                    var status = user.presence.activities[0] 
                }
            }
            else { 
                var fieldNameStatus = 'Activity'
                var status = "None" 
            }

            const embed = new MessageEmbed()
            .setAuthor(`${gMember.displayName}'s info`, user.avatarURL({type: 'png', dynamic: true}))
            .setThumbnail(user.avatarURL({type: 'png', dynamic: true}))
            .addFields(
                {name: 'Status', value: user.presence.status, inline: true},
                {name: 'Bot?', value: user.bot, inline:true},
                {name: 'ID', value: user.id},
                {name: fieldNameStatus, value: status},
                {name: 'Account Created', value: user.createdAt},
                {name: 'Date joined', value: gMember.joinedAt},
                {name: `Roles [${gMember._roles.length}]`, value: gMember.roles.cache.map(x => x).join(' ')}
            )
            await message.channel.send({embed: embed})
        }
        catch (error) {
            await message.channel.send(`\`${error}\``)
        }

    },
    name: 'userinfo',
    category: 'utilities',
    args: true,
    aliases: ['info'],
    description: "Gets a user's information"
}