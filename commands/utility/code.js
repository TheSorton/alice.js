const { Command } = require('discord.js-commando');
const discord = require('discord.js');


module.exports = class Code extends Command {
    constructor(client) {
		super(client, {
			name: 'code',
			aliases: ['source', 'src'],
			group: 'util',
			memberName: 'code',
			description: "Gives the source  code."
		});
	}
    run(message) {
        return message.say('https://gitlab.com/thesorton/alice');
    }
};