import * as Discord from 'discord.js';
import * as config from '../config/config.json';
import Command from './lib/command';
import aliceClient from './lib/aliceClient';
import Enmap from 'enmap'

const token = config.bot.token
export const client = new aliceClient({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

const cooldowns: Discord.Collection<string, Discord.Collection<string, number>> = new Discord.Collection();

client['guildData'] = new Enmap({
  name: 'guilds'
})

client['userData'] = new Enmap({
  name: 'users'
}) 

client.on('ready', () => {

  client['guildData'].defer.then( () => {
    for (let guild of client.guilds.cache.array()) {
      if (!client['guildData'].has(guild.id)) {
        client['guildData'].set(guild.id,
        {
          name: guild.name,
          systemChannel: parseInt(guild.systemChannelID),
          prefix: config.bot.prefix
        });
      };
    };
  });

  console.log(`https://discordapp.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=0&scope=bot`);
  console.log('Client is ready!');

});

client.on('message', message => {
  if (message.author.bot) return;
  if (message.guild) {
    var prefix: string = client['guildData'].get(message.guild.id, 'prefix');
  }
  else {
    var prefix: string = config.bot.prefix;
  }
  const args: string[] = message.content.slice(prefix.length).split(/ +/);
  const cmdName: string = args.shift();


  let commandType: string | undefined;

  for (const command of client.commands) {
    if (message.content.startsWith(prefix)) {
      commandType = command[1].get(cmdName) as string;
    }
    else return;
  }
  
  if (!typeof commandType) return;

  if (!cmdName) return;
  const commandName: string = cmdName.toLowerCase();
 
  const possibleCommands: Discord.Collection<string, string | Command> | undefined = client.commands.get('commands');

  if (!typeof possibleCommands) return;
  
  const command = (possibleCommands.get(commandName) || possibleCommands.find((cmd: string | Command) => {
      if (typeof cmd === 'string') return false;
      if (cmd.aliases && cmd.aliases.includes(commandName)) return true;
      else return false;
    })) as Command;

  
  if (!command) return;

  if (command.guildOnly && message.channel.type !== 'text') {
    return message.reply('This command is only available on servers.');
  }

  if (command.ownerOnly && message.author.id != config.bot.owner) {
    return message.reply('You must be the bot\'s owner.');
  }

  if (command.adminRequired && !(message.member === null) && !message.member.hasPermission('ADMINISTRATOR')) {
    return message.reply("You don't have adequate permissions!");
  }

  if (command.argsRequired && !args.length) {
    let reply = `You didn't provide the necessary arguments.`;
      if (command.usage) {
        reply += `\nThe proper usage would be: \`${getPrefix(client, message) + command.usage}\``;
      }
    return message.reply(reply);
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
    if (command.name === 'help') {
      return command.run(message, args, client);
    }
    else {
      return command.run(message, args, client)
    }
  }
  catch (error) {
    console.error(error);
    return;
  };
});

export const getPrefix = (client: aliceClient, message: Discord.Message) => {
  const prefix: string = client['guildData'].get(message.guild.id, 'prefix')
  return prefix
}

client.on('guildMemberRemove', async member => {
      member.guild.systemChannel.send(`**${member.user.tag}** has left.`)
})
client.on('guildMemberAdd', async member => {
      member.guild.systemChannel.send(`**${member.user.tag}** has joined.`)
})

client.login(token);
process.on('unhandledRejection', console.error);