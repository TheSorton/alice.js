import * as fs from 'fs';
import * as Discord from 'discord.js';
import Command from './command';
import config from '../../config/config.json'

export const prefix = config.bot.prefix;
export const owner = parseInt(config.bot.owner)

export default class aliceClient extends Discord.Client {
  commands: Discord.Collection<string, Discord.Collection<string, string | Command>>;
  constructor(props: Discord.ClientOptions) {
    super(props);
    this.commands = new Discord.Collection();
    const commandFolders: string[] = fs.readdirSync('./src/commands');
    const commands: Discord.Collection<string, string | Command> = new Discord.Collection();

    for (const folder of commandFolders) {
      const commandFiles: string[] = fs.readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith('.ts'));
      for (const file of commandFiles) {
        const command: Command = require(`${__dirname}/../commands/${folder}/${file}`);
        commands.set(command.name, command);
      }
      this.commands.set(prefix, commands);
      commands.set('name', prefix);
    }
  }
}