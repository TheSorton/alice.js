const { Command } = require('discord.js-commando');
const discord = require('discord.js');
const config = require('../../config.json')


module.exports = class Mute extends Command {
    constructor(client) {
		super(client, {
			name: 'mute',
			group: 'admin',
			memberName: 'mute',
            description: "Mutes a user.",
            userPermissions: ['MANAGE_ROLES'],
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
        message.guild.member(user).roles.add(config['Bot']['Mute'])
        message.say(`${user} has been muted.`)
    }
};