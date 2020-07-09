const discord = require('discord.js')
const client = new discord.Client({ partials: ['MESSAGE', 'REACTION']})
const fs = require('fs')

const config = require('./config/config.json')
const { helpers } = require('./utils/helpers')
const { userRoles } = require('./utils/userRoles')
const prefix = config.bot.prefix
client.commands = new discord.Collection();

const database = require('./database/database')
const messageModel = require('./database/models/message')
const cachedMessageReaction = new Map();
const configModel = require("./database/models/server")


client.login(config.bot.token)
client.on('ready', () => {
    console.log(`${client.user.tag} has sucessfully logged in. My ID is: ${client.user.id}.\nThe current time is ${helpers.time()}`)
    client.user.setActivity(`${config.bot.prefix}help`, { type: 'PLAYING' });
    database.then(() => console.log("Connected to MongoDB")).catch(err => console.log(err));
});

const walk = (dir) => {
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
    if (message.author.bot) return
    if (!message.content.startsWith(prefix)) return
    let args = message.content.slice(prefix.length).split(/ +/);
    let cmdName = args.shift();

	const command = client.commands.get(cmdName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));

    if (!command) return;
    
	if (command.guildOnly && message.channel.type !== 'text') {
		return message.reply('I can\'t execute that command inside DMs!');
    }
    
	if (command.argsReq && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;
		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
        }
        
		return message.channel.send(reply);
	}
	try {
		command.run(client, message, args);
    } 
    catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

// Logging
const log = walk('./log');
for (const file of log) {
    eval(fs.readFileSync(file)+'');
}

client.on('messageReactionAdd', async (reaction, user) => {
    if (user.bot) return;
    if (reaction.message.partial) {
        await reaction.message.fetch();
        let { id } = reaction.message
        try {
            let msgDoc = await messageModel.findOne({ messageID: id });
            if (msgDoc) {
                cachedMessageReaction.set(id, msgDoc.emojiRoleMap);
                let { emojiRoleMap } = msgDoc;
                userRoles.addUserRole(reaction, user, emojiRoleMap);

            }
        }
        catch(err) {
            console.log(err);
        }
    }
    else {
        let emojiRoleMap = cachedMessageReaction.get(reaction.message.id);
        userRoles.addUserRole(reaction, user, emojiRoleMap);

    }
});

client.on('messageReactionRemove', async (reaction, user) => {
    if (user.bot) return;
    if (reaction.message.partial) {
        await reaction.message.fetch();
        let { id } = reaction.message
        try {
            let msgDoc = await messageModel.findOne({ messageID: id });
            if (msgDoc) {
                cachedMessageReaction.set(id, msgDoc.emojiRoleMap);
                let { emojiRoleMap } = msgDoc;
                userRoles.delUserRole(reaction, user, emojiRoleMap);

            }
        }
        catch(err) {
            console.log(err);
        }
    }
    else {
        let emojiRoleMap = cachedMessageReaction.get(reaction.message.id);
        userRoles.delUserRole(reaction, user, emojiRoleMap);

    }
})

client.on('guildCreate', async (guild) => {
    let msgDoc = await configModel.findOne({ guildID: guild.id });
    if (msgDoc) return
    else {
        let doc = await configModel
        .findOne({ guildID: guild.id })
        .catch(err => console.log(err));
        if (doc) return
        else {
            let dbSvrModel = new configModel({
                guildID: guild.id,
                config: {}
            });
        
            dbSvrModel.save()
                .catch(err => console.log(err))
                .then(console.log(`${guild.name} has been added to the database.`))
        }
    }   

})