import {Message} from 'discord.js';
import { prefix } from '../../lib/aliceClient';

module.exports = {
  name: 'code',
  description: 'Get a link to the bot\'s GitHub.',
  run(message: Message) {
    message.reply('https://github.com/thesorton/alice/tree/typescript/')
  },
};
