module.exports = {
    run: async(client, message, args) => {
        try {
            message.channel.send(args.join(' '))
        }
        catch (error) {
            await message.channel.send(`\`${error}\`\n You shouldn't see this. Contact alan ✨#1989`)
        }
    },
    name: 'say',
    category: 'misc',
    args: true,
    aliases: ['repeat'],
    description: 'Says what you want',
    usage: '`say <sentence>`'
}