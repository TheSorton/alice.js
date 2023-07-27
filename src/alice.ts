const fs = require('fs');
const path = require('path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = "mongodb://127.0.0.1:27017";
import { pingMongoDB, createMongoCollection, queryMongoCollection } from './lib/mongo/mongo';

import * as config from '../config/config.json'
import { textColor } from './lib/colors';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.warn(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.ts'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

export const mClient = new MongoClient(uri,  {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	}
});

client.login(config.bot.token);  
/* ON client ready */
client.once(Events.ClientReady, async (c) => {
	console.log(`${textColor.fgGreen}✨ Logged in as ${c.user.tag}!\n${textColor.reset}`);
	await pingMongoDB(mClient);
	await createMongoCollection(mClient, c);
	await queryMongoCollection("alice", "users", {username: "arisu"}, mClient);
});
