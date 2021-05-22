import {Message} from 'discord.js'
import * as config from '../../../config/config.json';
const prefix = config.bot.prefix;

module.exports = {
  name: 'modme',
  description: 'Mods alan',
  usage: `modme (if you're alan)`,
  guildOnly: true,
  async run(message: Message, args: string[] ) {
    if (message.author.id === '330568495769190401') message.reply(`Test passes, welcome back alan.`);
    let username = await message.author.fetch().then(x => { return x.username})
    var gMember = message.guild.member(message.guild.members.cache.find(user => user.user.username === username))
    let modRole = message.guild.roles.cache.find(x => x.name === '')
    gMember.roles.add(modRole)

  }
};
