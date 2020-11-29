import {Message} from 'discord.js'
import * as config from '../../../config/config.json';
const prefix = config.bot.prefix;

module.exports = {
  name: 'kick',
  description: 'Kick a member',
  usage: `${prefix}kick @User [Reason]`,
  run(message: Message, args: string[] ) {
    if (!message.member.permissions.has("BAN_MEMBERS")) return message.reply(`You can't do that.`);
    if (message.mentions.users.first()) {
      const gMember = message.guild.member(message.mentions.users.first())
      gMember.kick(args.slice(1).join(" "));
    }
  }
};  

