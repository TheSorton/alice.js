const { Command } = require('discord.js-commando');
const discord = require('discord.js');
const config = require('../../config.json')


module.exports = class addRole extends Command {
    constructor(client) {
		super(client, {
            name: 'lsar',
            aliases: ['listroles'],
			group: 'roles',
			memberName: 'lsar',
            description: "Lists out the self-assignable roles.",
            });
        }
    
    run(message) {
        const roleList = new discord.MessageEmbed()
        .setAuthor('Self-assignable roles')
        .addField('Roles', config['Roles'].join('\n'))
        message.say({embed: roleList})
    }
}
