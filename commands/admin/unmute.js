const { Command } = require('discord.js-commando');
const discord = require('discord.js');
const config = require('../../config.json')


module.exports = class Unmute extends Command {
    constructor(client) {
		super(client, {
			name: 'unmute',
			group: 'admin',
			memberName: 'unmute',
            description: "unmutes a user.",
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
        if (message.guild.member(user).roles.cache.some(role => role.name === 'silenced')) {
        message.guild.member(user).roles.remove(config['Bot']['Mute'])
        message.say(`**${user}** has been unmuted.`)
        }
        else {
            message.say(`${user} is not muted.`)
        }

    }
};