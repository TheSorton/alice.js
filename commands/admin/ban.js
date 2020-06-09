const { Command } = require('discord.js-commando');
const discord = require('discord.js');


module.exports = class Ban extends Command {
    constructor(client) {
		super(client, {
			name: 'ban',
			group: 'admin',
			memberName: 'ban',
            description: "Bans a user. If no reason is given, 'No reason given' is the reason",
            args: [
                {
                    type: "user",
                    prompt: "",
                    key: "user"
                },
                {
                    type: "string",
                    prompt: "",
                    key: "string",
                    default: "No reason given"
                }],
                
                argsPromptLimit: 0
		});
	}
    run(message, { user, string }) {
        message.guild.member(user).ban({reason: string})
        message.say(`**${user.tag}** has been banned.`)
    }
};