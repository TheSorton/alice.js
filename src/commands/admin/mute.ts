import {Message} from 'discord.js'
import aliceClient from '../../lib/aliceClient';

module.exports = {
  name: 'mute',
  description: 'Mutes a member',
  usage: `mute @User`,
  aliases: ['gag'],
  guildOnly: true,
  async run(message: Message, args: string[], client: aliceClient) {
    if (!message.member.permissions.has("MANAGE_ROLES")) return message.reply(`You can't do that.`);

    if (message.mentions.users.first()) {
      let prefix: string = client['guildData'].get(message.guild.id, 'prefix')
      let member = message.mentions.members
      let roleName: string = client['guildData'].get(message.guild.id, 'muteRole')
      let muteRole = message.guild.roles.cache.find(x => x.name === roleName);
      if (muteRole != undefined) {
        member.forEach(x => x.roles.add(muteRole));
        return await message.reply('Muted');
      }
      else message.reply(`Set the mute role using \`${prefix}mute set role\``)
    }

    else if (args[0] === 'set') {
      let muteRole = message.guild.roles.cache.find(x => x.name === args[1]);
      client['guildData'].set(message.guild.id, args[1], 'muteRole')
      message.reply(`Mute role has been set to \`${args[1]}\``)
    };
  },
};  

