module.exports = {
    run: async(client, message, args) => {
    try {
        if(!message.member.permissions.has("KICK_MEMBERS")) return message.channel.send(`You can't do that.`);
        const gMember = message.guild.member(message.mentions.users.first());
        await gMember.kick();
    }
    catch(error) {
        console.log(error)
        if (error.httpStatus === 403) await message.channel.send("I can't do that.")
        else await message.channel.send(`\`${error}\``)
    }
    },
    name: 'kick',
    category: 'admin',
    description: 'Kicks a guild member.',
    usage: '`kick <@User>`'
}