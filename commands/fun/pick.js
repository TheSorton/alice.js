const config = require('../../config/config.json')

module.exports = {
    run: async(client, message) => {
        try {
            let args = message.content.slice(6).split(', ');
            let out = args.map(arg => arg.replace(/@everyone/g, 'everyone'));
            if (!out[1]) {
                await message.reply(`Too few arguments. You need at least two. Use ${config.bot.prefix}help pick`)
                return;
            }
            await message.reply(`I pick **${out[Math.floor(Math.random() * out.length)]}**`)
        }
        catch (error) {
            await message.channel.send(`\`${error}\`\n You shouldn't see this. Contact alan ✨#1989`)
        }
    },
    name: 'pick',
    category: 'fun',
    args: true,
    description: 'Picks from given choices',
    usage: '`pick <choice1>, <choice2>, [choice3], [choice4], ...`'
}