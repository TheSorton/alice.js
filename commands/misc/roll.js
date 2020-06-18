const { helpers } = require('../../utils/helpers')

module.exports = {
    run: async(client, message, args) => {
        message.reply(`You rolled ${helpers.rollDice()}`)
    },
    name: 'roll',
    category: 'misc',
    aliases: ['dice'],
    description: 'Rolls a dice.'
}