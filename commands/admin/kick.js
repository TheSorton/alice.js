module.exports = {
    run: async(client, message, args) => {

        if(!message.member.permissions.has("KICK_MEMBERS")) return message.channel.send(`You can't do that.`);
        const gMember = message.guild.member(message.mentions.users.first());
        await gMember.kick();

    },
    name: 'kick',
    category: 'admin',
    description: 'Kicks a guild member.',
    usage: '`kick <@User>`'
}