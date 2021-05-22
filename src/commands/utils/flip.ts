
import { cleanEveryone, cleanHere } from "../../lib/sanitize";
import {Message, MessageEmbed,MessageAttachment} from 'discord.js';
import aliceClient, { prefix } from '../../lib/aliceClient';

module.exports = {
  name: 'flip',
  description: 'flips a coin',
  usage: `flip`,
  async run(message: Message, args: string[], client: aliceClient) {
      let coin: string[] = ['heads', 'tails']
      let out = coin.map(arg => cleanEveryone(cleanHere(arg)));

      await message.reply(`I pick **${out[Math.floor(Math.random() * out.length)]}**`)
  }
}
