import {Message} from 'discord.js'
import * as config from '../../../config/config.json';
const prefix = config.bot.prefix;

module.exports = {
  name: 'kick',
  description: 'Kick a member',
  usage: `kick @User [Reason]`,
  guildOnly: true,
  run(message: Message, args: string[] ) {
    if (!message.member.permissions.has("BAN_MEMBERS")) return message.reply(`You can't do that.`);
    if (message.mentions.users.first()) {
      if (message.mentions.users.first()) {
        var reason: string = args.slice(2).join(' ').replace(/(<@!\d*>,\ *|<@!\d*>\ *)/gm, '')
        let member = message.mentions.members
        member.forEach(x => {
          if (!x.kickable) return message.channel.send("You cannot kick this user.");
        });
        member.forEach(x => x.kick(reason).catch(console.error));
      }
    }
  }
};  

