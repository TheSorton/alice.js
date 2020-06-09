const { Command } = require('discord.js-commando');
const discord = require('discord.js');


module.exports = class Avatar extends Command {
    constructor(client) {
		super(client, {
			name: 'avatar',
			aliases: ['av'],
			group: 'util',
			memberName: 'avatar',
            description: "Gets the user's avatar.",
            args: [
                {
                    type:"user",
                    prompt:"",
                    key:"user",
                    default: msg => msg.author
                }],
                argsPromptLimit: 0
		});
	}
    run(message, {user}) {
    const avatar = new discord.MessageEmbed()
        .setColor('#363636')
        .setAuthor(`${user.tag}'s avatar`, user.avatarURL({format: 'png', size: 4096, dynamic: true}))
        .setImage(user.avatarURL({format: 'png', size: 4096, dynamic: true}))

    return message.embed(avatar)
    };
};