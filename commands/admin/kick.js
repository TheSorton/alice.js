const { Command } = require('discord.js-commando');
const discord = require('discord.js');


module.exports = class Kick extends Command {
    constructor(client) {
		super(client, {
			name: 'kick',
			group: 'admin',
			memberName: 'kick',
            description: "Kicks a user.",
            args: [
                {
                    type:"user",
                    prompt:"",
                    key:"user",
                }],
                argsPromptLimit: 0
		});
	}
    run(message, {user}) {
        message.guild.member(user).kick()
        message.say(`**${user.tag}** has been kicked.`)
    }
};