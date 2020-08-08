module.exports = {
  run: async(client, message, args) => {
    try {
      message.channel.send('https://github.com/thesorton/alice')
    }
    catch (error) {
      await message.channel.send(`\`${error}\``)
    }
  },
  name: 'code',
  category: 'meta',
  args: false,
  aliases: ['src', 'source'],
  description: 'Links the source code'
}
