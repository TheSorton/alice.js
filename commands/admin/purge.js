const { Error } = require("mongoose")

module.exports = {
    run: async(client, message, args) => {

        if (!message.member.permissions.has("MANAGE_MESSAGES")) return message.channel.send(`You can't do that.`)
        if (!args[0]) return await message.reply('Specify a number of messages.')
        if (Number(args[0]) > 100) return await message.reply("I can only delete up to 100 messages.")
        message.channel.bulkDelete(Number(args[0])+1, true)

    },
    name: 'purge',
    category: 'admin',
    description: 'Purges a number of messages.',
    aliases: ['prune', 'bulkdelete'],
    usage: '`purge <Amount>`'
}