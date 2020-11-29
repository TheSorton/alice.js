import {Client as client, Message} from 'discord.js'
import * as config from '../../../config/config.json';
import aliceClient from '../../lib/aliceClient';
const prefix = config.bot.prefix;

module.exports = {
  name: 'prefix',
  description: 'Change the bot\'s prefix',
  usage: `${prefix}prefix character`,
  argsRequired: true,
  run(message: Message, args: string[], client: aliceClient ) {
    if (!message.member.permissions.has("MANAGE_GUILD")) return message.reply(`You can't do that`);
    if (client['guildData'].has(message.guild.id)) {
      let guild = client['guildData'].get(message.guild.id)
      guild.prefix = args[0];
      console.log(guild)
    }
  }
};  

