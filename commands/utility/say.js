const { Command } = require('discord.js-commando');

module.exports = class SayCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'say',
			aliases: ['parrot', 'copy'],
			group: 'util',
			memberName: 'say',
			description: 'Replies with the text you provide.',
            args: [{
                key: 'args',
                prompt: "",
                type: 'string'
        }],
            argsPromptLimit: 0
		});
	}

	run(message, { args }) {
		return message.say(args);
	}
};