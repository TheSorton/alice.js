module.exports = {
    run: async(client, message, args) => {
        message.channel.send('https://github.com/thesorton/alice')
    },
    name: 'code',
    category: 'utilities',
    args: false,
    aliases: ['src', 'source'],
    description: 'Links the source code'
}