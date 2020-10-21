const { helpers } = require('../../utils/helpers')
const config = require('../../config/config.json')

module.exports = {
  run: async(client, message, args) => {
    try {
      if (args[0]) {
        let die = args[0].replace(/[^1-9]/g,"");
        await message.reply(`You rolled ${helpers.rollDice(die)}`)
      }
      else return message.reply(`You rolled ${helpers.rollDice(6)}`)
    }
    catch (error) {
      await message.channel.send(`\`${error}\``)
    }
  },
  name: 'roll',
  category: 'fun',
  aliases: ['dice'],
  description: 'Rolls a dice. Defaults to 6.',
  usage: `\`${config.bot.prefix}roll [dice-size (for example d145)]\``
}
