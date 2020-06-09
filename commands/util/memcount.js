const { Command } = require('discord.js-commando');
const discord = require('discord.js');


module.exports = class MemberCount extends Command {
    constructor(client) {
		super(client, {
			name: 'memcount',
			aliases: ['membercount'],
			group: 'util',
			memberName: 'memcount',
			description: "Counts the member in the server."
		});
	}
    run(message) {
        return message.say(`This server has ${message.guild.memberCount} members.`);
    }
};