import {Message, TextChannel} from 'discord.js'

module.exports = {
  name: 'purge',
  description: 'Bulk deletes a number of messages',
  usage: `purge number`,
  guildOnly: true,
  async run(message: Message, args: string[] ) {
    if (!message.member.permissions.has("MANAGE_MESSAGES")) return message.channel.send(`You can't do that.`);
    if (!args[0]) return message.reply('Specify a number of messages.');
    if (Number(args[0]) > 100) return message.reply("I can only delete up to 100 messages.");
    (message.channel as TextChannel).bulkDelete(Number(args[0]) + 1, true);
  }
};