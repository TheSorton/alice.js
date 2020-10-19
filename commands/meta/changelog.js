const { MessageEmbed } = require("discord.js")

module.exports = {
    run: async(client, message, args) => {
        const embed = new MessageEmbed()
            .setAuthor('alice 3.5.0 changelog', client.user.avatarURL({format: 'png', dynamic: 'true' }))
            .attachFiles(['res/img/changelog.png'])
            .setImage('attachment://changelog.png')
            .addFields(
                { name: 'MyAnimeList', value: `Using [Jikan's API](https://jikan.moe/), I was able to add the anime, manga, and character commands.` },
                { name: 'Misc fixes', value: `Removed some dead links here and there and under-the-hood changes.`}
            )
            await message.channel.send(embed)
    },
    name: 'changelog',
    category: 'meta',
    args: false,
    aliases: ['changes'],
    description: 'View the changelog'
  }
  