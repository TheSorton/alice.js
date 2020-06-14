const { Command } = require('discord.js-commando');
const discord = require('discord.js');
const config = require('../../config.json')


module.exports = class addRole extends Command {
    constructor(client) {
		super(client, {
            name: 'iamnot',
            aliases: ['iamn', 'roleremove'],
			group: 'roles',
			memberName: 'iamnot',
            description: "Removes the specified role from the user if it's self assignable and isnt the muted role.",
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
            if (role.id === config['Bot']['Mute']) {
                message.reply("You can't remove your mute.")
            }
            else {
                message.member.roles.remove(role)
                message.reply(`**${role.name}** has been removed.`)
            }
        }
        else {
            message.reply(`**${role.name}** is not self-assignable. Use ${config['Bot']['Prefix']}lsar to see roles.`)
        }
    }};

