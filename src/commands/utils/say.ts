import {Message} from 'discord.js';
import { prefix } from '../../lib/aliceClient';

module.exports = {
  name: 'say',
  description: 'A basic say command.',
  usage: `${[prefix]}say something`,
  argsRequired: true,
  cooldown: 30,
  run(message: Message, args: string[] ) {
    message.reply(args.join(' '))
  },
};
