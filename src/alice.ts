import fs from "fs";
import path from "path";
const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");
import { MongoClient, ServerApiVersion } from "mongodb";
import {
  pingMongoDB,
  createMongoCollection,
} from "./lib/mongo/mongo";

import * as config from "../config/config.json";
import { textColor } from "./lib/colors";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
export let mongoEnabled: boolean = false;

client.commands = new Collection();
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".ts"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.warn(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".ts"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}
export const mongoUri = "mongodb://127.0.0.1:27017";

export const mClient = new MongoClient(mongoUri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export const mongoClient = mClient;

client.login(config.bot.token);
/* ON client ready */
client.once(Events.ClientReady, async (c) => {
  console.log(
    `${textColor.fgGreen}✨ Logged in as ${c.user.tag}!\n${textColor.reset}`
  );
  console.log(`${textColor.fgBlue}🔄 Checking MongoDB connection...${textColor.reset}`)
  try {
    if (await pingMongoDB()) {
      mongoEnabled = true;
    }
  } catch (e) {
    console.error(e)
    mongoEnabled = false;
  }
  try {
    if (mongoEnabled) {
      await createMongoCollection(c);
  }
  } catch (e) {
    console.error(`${textColor.fgRed}❌ [alice.ts:81] Error connecting to MongoDB. Check your connection string or check to see if MongoDB is running.${textColor.reset}`)
    mongoEnabled = false;
  }
});
