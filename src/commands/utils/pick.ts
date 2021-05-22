import { cleanEveryone, cleanHere } from "../../lib/sanitize";
import {Message, MessageEmbed,MessageAttachment} from 'discord.js';
import aliceClient, { prefix } from '../../lib/aliceClient';

module.exports = {
  name: 'pick',
  description: 'picks something.',
  usage: `pick <choice1>, <choice2> `,
  async run(message: Message, args: string[], client: aliceClient) {
      let choices = message.content.slice(6).split(', ')
      let out = choices.map(arg => cleanEveryone(cleanHere(arg)));

      if (!out[0]) return await message.reply('what did you want me to pick?')
      if (!out[1]) return await message.reply('too few arguments. You need at least two.');

      await message.reply(`I pick **${out[Math.floor(Math.random() * out.length)]}**`)
  }
}
