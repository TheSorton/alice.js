const { helpers } = require('../../utils/helpers')

module.exports = {
    run: async(client, message, args) => {
        try {
            message.reply(`You rolled ${helpers.rollDice()}`)
        }
        catch (error) {
            await message.channel.send(`\`${error}\``)
        }
    },
    name: 'roll',
    category: 'fun',
    aliases: ['dice'],
    description: 'Rolls a dice.'
}