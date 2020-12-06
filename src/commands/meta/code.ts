import {Message} from 'discord.js';

module.exports = {
  name: 'code',
  description: 'Get a link to the bot\'s GitHub.',
  aliases: ['src', 'github', 'source'],
  run(message: Message) {
    message.reply('https://github.com/thesorton/alice/tree/typescript/')
  },
};
