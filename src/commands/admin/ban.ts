import {Message} from 'discord.js'
import * as config from '../../../config/config.json';
const prefix = config.bot.prefix;

module.exports = {
  name: 'ban',
  description: 'Bans a member',
  usage: `ban @User [Reason]`,
  run(message: Message, args: string[] ) {
    if (!message.member.permissions.has("BAN_MEMBERS")) return message.reply(`You can't do that.`);
    if (message.mentions.users.first()) {
      const gMember = message.guild.member(message.mentions.users.first())
      gMember.ban({ reason: args.slice(1).join(" ") } )
    }
  }
};