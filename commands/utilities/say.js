module.exports = {
    run: async(client, message, args) => {
        message.channel.send(args.join(' '))
    },
    name: 'say',
    category: 'utilities',
    args: true,
    aliases: ['repeat'],
    description: 'Says what you want',
    usage: 'say <sentence>'
}