import {Message, MessageEmbed} from 'discord.js';
import { prefix } from '../../lib/aliceClient';
import { bestMatch } from '../../lib/search';

module.exports = {
  name: 'avatar',
  description: 'Get someone\'s avatar.',
  usage: `avatar [(@)User]`,
  aliases: ['av'],
  async run(message: Message, args: string[]) {
    const { username, score } = bestMatch(message, args)
    var embed = new MessageEmbed()
    
    if (args[0] === undefined) {
      embed.setAuthor(`${message.author.username}'s avatar.`, message.author.avatarURL());
      embed.setImage(message.author.avatarURL({format: "png", dynamic: true, size: 2048}));
      
      await message.reply(embed)
    }
    else if (args[0].length === 18) {
      let gMember = message.guild.member(message.guild.members.cache.find(user => user.id === args[0]))
      embed.setAuthor(`${gMember.user.username}'s avatar.`, gMember.user.avatarURL());
      embed.setImage(gMember.user.avatarURL({ format: "png", dynamic: true, size: 2048}))
      await message.reply(embed)
    }
    else {
      if (message.mentions.users.first()) {
        var gMember = message.guild.member(message.mentions.users.first())
      }
      else {
        var gMember = message.guild.member(message.guild.members.cache.find(user => user.displayName === username))
      }
      if (gMember) {
        embed.setAuthor(`${gMember.user.username}'s avatar.`, gMember.user.avatarURL());
        embed.setImage(gMember.user.avatarURL({ format: "png", dynamic: true, size: 2048}))
        await message.reply(embed)
      }
      else await message.reply("That user is not found. Try pinging them.");
    }
  }
};
