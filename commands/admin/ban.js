module.exports = {
    run: async(client, message, args) => {

        if(!message.member.permissions.has("BAN_MEMBERS")) return message.channel.send(`You can't do that.`)
        const gMember = message.guild.member(message.mentions.users.first())
        await gMember.ban({ reason: args.slice(1).join(" ") } )

    },
    name: 'ban',
    category: 'admin',
    aliases: [],
    description: 'Bans a guild member by their ID',
    usage: 'ban <@User>'
}