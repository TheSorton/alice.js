import { Message, MessageEmbed, User, GuildMember, Guild, Activity } from 'discord.js';
import { prefix } from '../../lib/aliceClient';
import { bestMatch } from '../../lib/search';

import { cleanEveryone, cleanHere } from "../../lib/sanitize";
module.exports = {
  name: 'userinfo',
  description: 'Get\'s information regardin g a user',
  usage: `userinfo`,
  guildOnly: true,
  async run(message: Message, args: string[]) {
    const { username, score } = bestMatch(message, args)
    var embed = new MessageEmbed()
    
    if (args[0] === undefined) {
      let username = await message.author.fetch().then(x => { return x.username})
      var gMember = message.guild.member(message.guild.members.cache.find(user => user.user.username === username))
      var foundUser: User = gMember.user
      console.log(foundUser)
      embed.setAuthor(`${message.author.username}'s information.`, message.author.avatarURL());
      embed.setThumbnail(message.author.avatarURL({ format: "png", dynamic: true, size: 2048 }));

      
    }
    else if (args[0].length === 18) {
      var gMember = message.guild.member(message.guild.members.cache.find(user => user.id === args[0]))
      console.log(gMember)
      var foundUser: User = gMember.user
      embed.setAuthor(`${gMember.user.username}'s information.`, gMember.user.avatarURL());
      embed.setThumbnail(gMember.user.avatarURL({ format: "png", dynamic: true, size: 2048 }))

    }
    else {
      if (message.mentions.users.first()) {
        var gMember = message.guild.member(message.mentions.users.first())
      }
      else {
        var gMember = message.guild.member(message.guild.members.cache.find(user => user.displayName === username))
      }
      if (gMember) {
        var foundUser: User = gMember.user
        embed.setAuthor(`${gMember.user.username}'s information.`, gMember.user.avatarURL());
        embed.setThumbnail(gMember.user.avatarURL({ format: "png", dynamic: true, size: 2048 }))
      }
      else await message.reply("That foundUser is not found. Try pinging them.");
    }

    if (foundUser) {
      if (foundUser.presence.activities[0]) {
        if (foundUser.presence.activities[0].state) {
          if (foundUser.presence.activities[0].name === 'Spotify') {
            var fieldNameStatus = 'Spotify'
            var status: String | Activity = `**${foundUser.presence.activities[0].details}** by **${foundUser.presence.activities[0].state}**`
          }
          else {
            var fieldNameStatus = 'Custom Status'
            var status: String | Activity = foundUser.presence.activities[0].state
          }
        }

        else {
          var fieldNameStatus = 'Activity'
          var status: String | Activity = foundUser.presence.activities[0]
        }
      }
      else {
        var fieldNameStatus = 'Activity'
        var status: String | Activity = "None"
      }
    
      
      embed.addFields(
        { name: 'Status', value: foundUser.presence.status, inline: true },
        { name: 'Bot?', value: foundUser.bot, inline: true },
        { name: 'ID', value: foundUser.id },
        { name: fieldNameStatus, value: status },
        { name: 'Account Created', value: foundUser.createdAt },
        { name: 'Date joined', value: gMember.joinedAt },
      )
    }
    message.reply(embed)
  },
};
