
const { clean_everyone, clean_here } = require("../../utils/sanitize.js").sanitize;

module.exports = {
    run: async(client, message, args) => {
        try {
            if (!args[0]) return await message.reply('what did you want me to say?')

            let out = args.map(arg => clean_everyone(clean_here(arg)));
            await message.channel.send(out.join(' '))
        }
        catch (error) {
            await message.channel.send(`\`${error}\``)
        }
    },
    name: 'say',
    category: 'utilities',
    args: true,
    aliases: ['repeat'],
    description: 'Says what you want',
    usage: '`say <sentence>`'
}
