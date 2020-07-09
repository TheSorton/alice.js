module.exports = {
    run: async(client, message, args) => {
    try {
        if(!message.member.permissions.has("BAN_MEMBERS")) return message.channel.send(`You can't do that.`)
        const gMember = message.guild.member(message.mentions.users.first())
        await gMember.ban({ reason: args.slice(1).join(" ") } )
    }
    catch(error) {
        console.log(error)
        if (error.httpStatus === 403) await message.channel.send("I can't do that.")
        else await message.channel.send(`\`${error}\``)
    }
    },
    name: 'ban',
    category: 'admin',
    description: 'Bans a guild member by their ID',
    usage: '`ban <@User>`'
}