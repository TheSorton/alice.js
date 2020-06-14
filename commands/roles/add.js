const { Command } = require('discord.js-commando');
const discord = require('discord.js');
const config = require('../../config.json')


module.exports = class addRole extends Command {
    constructor(client) {
		super(client, {
            name: 'iam',
            aliases: ['addrole'],
			group: 'roles',
			memberName: 'iam',
            description: "Gives a user a specified role if it's self assignable",
            args: [
                {
                    type: "role",
                    prompt: "",
                    key: "role"
                },
            ],
                argsPromptLimit: 0
            });
        }

    run(message, {role}) {
        if (config['Roles'].includes(role.name)) {
             message.member.roles.add(role)
             message.reply(`**${role.name}** has been added.`)
        }
        else {
            message.reply(`**${role.name}** is not self-assignable. Use ${config['Bot']['Prefix']}lsar to see roles.`)
        }
    }};

