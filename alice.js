const discord = require('discord.js')
const client = new discord.Client()
const fs = require('fs')//.promises;
const path = require('path')

const config = require('./config/config.json')
const time = require('./utils/date.js')

const prefix = config.bot.prefix
client.commands = new discord.Collection();

client.login(config.bot.token)
client.on('ready', () => {
    console.log(`${client.user.tag} has sucessfully logged in. My ID is: ${client.user.id}.\nThe current time is ${time()}`)
})

const walk = function(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        file_type = file.split(".").pop();
        file_name = file.split(/(\\|\/)/g).pop();
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file_type == "js") results.push(file);
        }
    });
    return results;
}

const commandFiles = walk('./commands');

for (const file of commandFiles) {
    const command = require(`${file}`);
	client.commands.set(command.name, command);
}

client.categories = fs.readdirSync("./commands/");


client.on('message', message => {
    let args = message.content.slice(prefix.length).split(/ +/);
    let cmdName = args.shift();

	const command = client.commands.get(cmdName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));

	if (!command) return;

	if (command.guildOnly && message.channel.type !== 'text') {
		return message.reply('I can\'t execute that command inside DMs!');
	}

	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}

	try {
		command.run(client, message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});