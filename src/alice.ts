import * as Discord from 'discord.js';
import * as config from '../config/config.json';
import Command from './lib/command';
import aliceClient from './lib/aliceClient';

const prefix = config.bot.prefix
const token = config.bot.token
const client = new aliceClient({});

const cooldowns: Discord.Collection<string, Discord.Collection<string, number>> = new Discord.Collection();

client.on('ready', () => {
  console.log('Client is ready!');

});

client.on('message', message => {
  if (message.author.bot) return;
  const args = message.content.slice(prefix.length).split(/ +/);
  const cmdName = args.shift();


  let commandType: string | undefined;

  for (const command of client.commands) {
    if (message.content.startsWith(prefix)) {
      commandType = command[1].get(cmdName) as string;
    }
  }
  console.log('Line 31 (commandType filled): ' + commandType)
  if (!typeof commandType) return;

  if (!cmdName) return;
  const commandName: string = cmdName.toLowerCase();
  console.log(client.commands.get(prefix))
 
  const possibleCommands: Discord.Collection<string, string | Command> | undefined = client.commands.get(prefix);
  console.log('Line 44 (possibleCommands filled): ' + possibleCommands )  

  if (!typeof possibleCommands) return;
  console.log('Line 47 (typeof possibleCommands passes): ' + typeof possibleCommands )


  const command = (possibleCommands.get(commandName) || possibleCommands.find((cmd: string | Command) => {
      if (typeof cmd === 'string') return false;
      if (cmd.aliases && cmd.aliases.includes(commandName)) return true;
      else return false;
    })) as Command;

  console.log('Line 51 (command fills): ' + command )
  if (!command) return;

  console.log('Line 54 (command.guildOnly): ' + command.guildOnly )

  if (command.guildOnly && message.channel.type !== 'text') {
    return message.reply('Sorry, you can only use that command on servers!');
  }

  console.log(message.author.id != config.bot.owner)
  if (command.ownerOnly && message.author.id != config.bot.owner) {
    return message.reply('You must be the bot\'s owner.');
  }

  if (command.adminRequired && !(message.member === null) && !message.member.hasPermission('ADMINISTRATOR')) {
    return message.reply("You don't have adequate permissions!");
  }

  if (command.argsRequired && !args.length) {
    let reply = `You didn't provide the necessary arguments, ${message.author}!`;
      if (command.usage) {
        reply += `\nThe proper usage would be: \`${command.usage}\``;
      }
    return message.channel.send(reply);
  }

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }

  const now = Date.now();
  const timestamps: | Discord.Collection<string, number> | undefined = cooldowns.get(command.name);

  const cooldownAmount = command.cooldown * 1000;

  if (!(typeof timestamps === 'undefined')) {
    if (!timestamps.has(message.author.id)) {
      timestamps.set(message.author.id, now);
      setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    } else {
      const userCooldown: number | undefined = timestamps.get(
        message.author.id
      );

      if (typeof userCooldown === 'number') {
        const expirationTime = userCooldown + cooldownAmount;
        if (now < expirationTime) {
          const timeLeft = (expirationTime - now) / 1000;
          return message.reply(
            `You must wait **${timeLeft.toFixed(1)} seconds** before trying again.`
          );
        }
      }

      timestamps.set(message.author.id, now);
      setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }
  };

  try {
    command.run(message, args);
    return;
  }
  catch (error) {
    console.error(error);
    return;
  };
});

client.login(token);
process.on('unhandledRejection', console.error);
