module.exports = {
    run: async(client, message, args) => {

        if(!message.member.permissions.has("KICK_MEMBERS")) return message.channel.send(`You can't do that.`);
        const gMember = message.guild.member(message.mentions.users.first());
        const role = message.guild.roles.cache.get('541726283176869918');
        await gMember.roles.add(role);
        await message.reply(`**${gMember.user.tag}** has been muted.`)

    },
    name: 'mute',
    category: 'admin',
    aliases: ['silence', 'gag'],
    description: 'Mutes a guild member.',
    usage: '`mute <@User>`'
}