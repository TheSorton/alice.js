module.exports = {
    run: async(client, message, args) => {
        message.channel.send(args.join(' '))
    },
    name: 'say',
    category: 'misc',
    args: true,
    aliases: ['repeat'],
    description: 'Says what you want',
    usage: '`say <sentence>`'
}