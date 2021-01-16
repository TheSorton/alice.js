import {Message, MessageEmbed} from 'discord.js'
import aliceClient from '../../lib/aliceClient';

module.exports = {
  name: 'sdb',
  description: 'Dumps the server\'s database entry',
  aliases: ['serverDB'],
  guildOnly: true,
  async run(message: Message, args: string[], client: aliceClient) {
    if (!message.member.permissions.has("MANAGE_GUILD")) return message.reply(`You can't do that.`);
    const embed = new MessageEmbed()
      .setAuthor(client['guildData'].get(message.guild.id, 'name'), message.guild.iconURL({format: 'png', dynamic: true}))
      .addField('Prefix', client['guildData'].get(message.guild.id, 'prefix'))
      .addField('System Channel', `<#${client['guildData'].get(message.guild.id, 'systemChannel')}>`)
      .addField('Mute role', client['guildData'].get(message.guild.id, 'muteRole') || 'Not configured')
      .setTimestamp()
    message.reply(embed)
  },
};  

