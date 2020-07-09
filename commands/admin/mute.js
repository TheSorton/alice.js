const configModel = require("../../database/models/server")

module.exports = {
    run: async(client, message, args) => {
    try {
        if(!message.member.permissions.has("KICK_MEMBERS")) return message.channel.send(`You can't do that.`);
        const gMember = message.guild.member(message.mentions.users.first());
        let guild = configModel.findOne({ guildID: message.guild.id });
        if (guild) { 
            let { config } = await configModel.findOne({ guildID: message.guild.id }); ;
            let muteRole = config.muteRole 
            const role = message.guild.roles.cache.find(x => x.id === muteRole);
            await gMember.roles.add(role);
            await message.reply(`**${gMember.user.tag}** has been muted.`)
        }
    }
    catch(error) {
        console.log(error)
        if (error.httpStatus === 403) await message.channel.send("I can't do that.")
        else await message.channel.send(`\`${error}\``)
    }

    },
    name: 'mute',
    category: 'admin',  
    aliases: ['silence', 'gag'],
    description: 'Mutes a guild member.',
    usage: '`mute <@User>`'
}