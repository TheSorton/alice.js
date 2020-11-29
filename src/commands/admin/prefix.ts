import {Client as client, Message} from 'discord.js'
import * as config from '../../../config/config.json';
import aliceClient from '../../lib/aliceClient';
const prefix = config.bot.prefix;
import Enmap from 'enmap';

module.exports = {
  name: 'prefix',
  description: 'Change the bot\'s prefix',
  usage: `prefix character`,
  argsRequired: true,
  run(message: Message, args: string[], client: aliceClient) {
    let enmap: Enmap = client['guildData']
    if (!message.member.permissions.has("MANAGE_GUILD")) return message.channel.send(`You can't do that`);
    if (enmap.has(message.guild.id)) {
      enmap.set(message.guild.id, args[0], 'prefix'); 
    }
    message.reply(`Prefix has been set to: **${enmap.get(message.guild.id, "prefix")}** `)
  }
};  

