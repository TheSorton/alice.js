module.exports = {
    run: async(client, message, args) => {
        const rollDice = require('../../utils/dice')
        message.reply(`You rolled ${rollDice()}`)
    },
    name: 'roll',
    category: 'misc',
    aliases: ['dice'],
    description: 'Rolls a dice.'
}