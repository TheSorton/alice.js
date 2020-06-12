const { Command } = require('discord.js-commando');
const discord = require('discord.js');


module.exports = class Prune extends Command {
    constructor(client) {
		super(client, {
            name: 'prune',
            aliases: ['purge', 'bulkdelete'],
			group: 'admin',
			memberName: 'prune',
            description: "Prunes a specified number of messages.",
            userPermissions: ['MANAGE_MESSAGES'],
            args: [
                {
                    type:"integer",
                    prompt:"",
                    key:"integer",
                }],
                argsPromptLimit: 0
		});
    }
    run(message, {integer}) {
    if (integer > 100) {
        message.say("I only support deleting up to 99 messages.")
    }
    else {
        message.channel.bulkDelete(integer, true).catch(err => {
        console.log(err)
        message.channel.send('there was an error trying to prune messages in this channel!');
        });
        message.say("Done")
        .then(message => {
            message.delete({timeout: 1000})
          })

    }
}};