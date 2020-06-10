const Discord = require('discord.js');
const config = require('./config.json')
const { CommandoClient } = require('discord.js-commando');
const path = require('path');
const fs = require("fs");

const client = new CommandoClient({
	commandPrefix: config['Bot']['Prefix'],
    owner: config['Bot']['Owner'],
    disableEveryone: true
});

// Logging
eval(fs.readFileSync('util/log.js')+'');

client.registry
	.registerDefaultTypes()
	.registerGroups([
		['admin', 'Admin commands'],
		['utility', 'Utility commands'],
	])
	.registerDefaultGroups()
	.registerDefaultCommands()
    .registerCommandsIn(path.join(__dirname, 'commands'));
    

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
    client.user.setActivity(config['Bot']['Prefix'] + 'help');
});
    
client.on('messageUpdate', (oldMessage, newMessage) => {
	if (oldMessage.author === oldMessage.author.bot) return;
	else {
        console.log(oldMessage.content + '\n' + newMessage.content)
		const editEmbed = new Discord.MessageEmbed()
		.setColor('#363636')
		.addFields(
			{name: 'Original Message', value: oldMessage.content || "Message not found"},
			{name: 'Edited Message', value: newMessage.content || "Message not found"}
		)
		.setFooter(`Message ID: ${newMessage.id} | Author ID: ${newMessage.author.id}`)
        client.channels.cache.get(config['Channels']['Log']).send({embed: editEmbed })
	  }
  });
  
client.on('error', console.error);
client.login(config['Bot']['Token']);
