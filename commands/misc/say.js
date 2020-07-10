module.exports = {
    run: async(client, message, args) => {
        try {
            let out = args.map(arg => arg.replace(/@everyone/g, 'everyone'));
            await message.channel.send(out.join(' '))
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