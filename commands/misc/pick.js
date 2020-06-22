const config = require('../../config/config.json')

module.exports = {
    run: async(client, message) => {
        let args = message.content.slice(6).split(', ');
        if (!args[1]) {
            await message.reply(`Too few arguments. You need at least two. Use ${config.bot.prefix}help pick`)
            return;
        }
        await message.reply(`I pick **${args[Math.floor(Math.random() * args.length)]}**`)
    },
    name: 'pick',
    category: 'misc',
    args: true,
    description: 'Picks from given choices',
    usage: '`pick <choice1>, <choice2>, [choice3], [choice4], ...`'
}