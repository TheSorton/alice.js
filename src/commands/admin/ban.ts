import {Message} from 'discord.js'
import * as config from '../../../config/config.json';
const prefix = config.bot.prefix;

module.exports = {
  name: 'ban',
  description: 'Bans a member',
  usage: `ban @User [Reason]`,
  guildOnly: true,
  run(message: Message, args: string[] ) {
    if (!message.member.permissions.has("BAN_MEMBERS")) return message.reply(`You can't do that.`);
    if (message.mentions.users.first()) {
      var reason = args.slice(2).join(' ').replace(/(<@!\d*>,\ *|<@!\d*>\ *)/gm, '')
      let member = message.mentions.members
      member.forEach(x => {
          if (!x.bannable) return message.channel.send("You cannot ban this user.");
      });                       
      member.forEach(x => x.ban({ reason: reason }).catch(console.error));
    }
  }
};