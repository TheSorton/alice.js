module.exports = {
    run: async(client, message, args) => {
        message.channel.send('https://github.com/thesorton/alice.js')
    },
    name: 'code',
    category: 'utilities',
    args: false,
    aliases: ['src', 'source'],
    description: 'Links the source code'
}