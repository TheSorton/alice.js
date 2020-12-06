import {Message, MessageEmbed} from 'discord.js';
import * as fs from 'fs';
import aliceClient from '../../lib/aliceClient';
import { getPrefix } from '../../alice';


module.exports = {
  name: 'help',
  description: 'Lists all commands, or specific info for a command',
  aliases: ['commands'],
  usage: `help [command]`,
  cooldown: 0,
  guildOnly: false,
  adminReq: false,
  argsRequired: false,
  run(message: Message, args: string[], client: aliceClient) {
    const prefix: string = client['guildData'].get(message.guild.id, 'prefix')

    const commands = new Map();
    const aliases = new Map();

    const embedInitial = new MessageEmbed()
      .setTitle('**List of Commands:**')
      .setDescription(
        `\nUse \`${prefix}help [command name]\` to get info on a specific command.`
      )
      .setColor(0x00ae86)
      .setTimestamp();


    const getCommands = (commandFiles: string[], folder: string) => {
      const commandList = [];
      for (const file of commandFiles) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const command = require(`../${folder}/${file}`);
        if (command.ownerOnly) return
        commandList.push(command.name);
        console.log(folder, commandList, command.name)

        if (!commands.has(command.name)) {
          commands.set(command.name, command);
          if (command.aliases) {
            command.aliases.forEach((element: string) => {
              aliases.set(element, command);
            });
          };
        };
      };
      return commandList
    };

    const commandFolders = fs.readdirSync('./src/commands/');
    for (const folder of commandFolders) {
      const commandFiles = fs.readdirSync(`./src/commands/${folder}`)
        .filter(file => file.endsWith('.ts'));
      let commands = getCommands(commandFiles, folder)
      if (!commands) continue;

      const embedFieldBody = '`' + commands.join('`, `') + '`';
      embedInitial.addField(
        folder,
        embedFieldBody
      );
    }

    if (!args.length) {
      return message.reply(embedInitial)
        .catch(error => {
          console.error(error);
        });
    }

    const name = args[0].toLowerCase();
    const command = commands.get(name) || aliases.get(name);

    if (!command) {
      return message.reply("Sorry, that's not a valid command");
    }

    const embed = new MessageEmbed()
      .setTitle(`**${command.name}**`)
      .setColor(0x00ae86)
      .setTimestamp();
    if (command.description) embed.addField('**Description:**', command.description, false);
    if (command.aliases) embed.addField('**Aliases:**', command.aliases.join(', '), true);
    if (command.usage) embed.addField('**Usage:**', getPrefix(client, message) + command.usage, true);
    if (command.cooldown) embed.addField('**Cooldown:**', command.cooldown + ' seconds', false);
    if (command.guildOnly) embed.addField('** Server Only:**', command.guildOnly, true)

    message.reply(embed);
    return;
  },
};
