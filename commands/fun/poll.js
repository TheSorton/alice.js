const config = require('../../config/config.json')
const { MessageEmbed } = require('discord.js')
const { cleanEveryone, cleanHere } = require('../../utils/sanitize.js').sanitize;
const pollEmbed = require('../../utils/pollEmbed.js');

module.exports = {
  run: async(client, message) => {
    try {
      let args = message.content.slice(6).split(', ')
      let title = args[0];
      args.shift()
      let out = args.map(arg => cleanEveryone(cleanHere(arg)));
      console.log(args, title)
      if (!args[1]) return await message.reply("You must supply at least two choices")
      pollEmbed(message, title, args)
    }
    catch (err) {
      await message.channel.send(`\`${err}\``)
    }
  },
  name: 'poll',
  category: 'fun',
  args: true,
  description: 'Creates a poll.',
  usage: '`poll <choice>, <choice>, [choice] ...`'
}

