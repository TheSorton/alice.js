const { MessageEmbed } = require("discord.js")

module.exports = {
  run: async(client, message, args) => {
    try {
      const embed = new MessageEmbed()
        .setAuthor(client.user.username, client.user.avatarURL('png', true), 'https://alice.nyx.moe/')
        .setDescription(`[You may read my privacy policy here](https://alice.nyx.moe/privacy.html).`)
      await message.channel.send(embed)
    }
    catch (error) {
      await message.channel.send(`\`${error}\``)
    }
  },
  name: 'privacy',
  category: 'meta',
  args: false,
  description: 'Links the privacy policy'
}
