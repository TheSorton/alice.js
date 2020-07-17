var { serverQueueInit } = require('../../utils/queue').queue
const queue = new Map();


module.exports = {
    run: async(client, message, args) => {
        try {
        if (args) serverQueueInit(message, queue, args)
        }
        catch (error) {
            await message.channel.send(`\`${error}\`\n You shouldn't see this. Contact alan ✨#1989`)
        }
    },
    name: 'play',
    category: 'music',
    args: true,
    description: 'Plays a selected track'
}