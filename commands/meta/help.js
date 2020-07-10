const { MessageEmbed } = require("discord.js")
const config = require('../../config/config.json')
const { stripIndents } = require("common-tags");


module.exports = {
  run: async(client, message, args) => {
    try {
      const prefix = config.bot.prefix

      if (args[0]) {
        return getCMD(client, message, args[0]);
    } else {
        return getAll(client, message);
    }

      function getAll(client, message) {
        const embed = new MessageEmbed()
            .setColor("RANDOM")
            .setAuthor(`${config.bot.prefix}help [command] for more information on a command`)
    
            // Format the name of a category
            const category_name_fmt = cat => cat[0].toUpperCase() + cat.slice(1);

            // Create an array of commands (from client.command) to an array of
            // groups describing a category + its commands
            const group_cmd_into_categories = cmds => {
                const ret = {};
                const add_to_ret = cmd => {
                    if (ret[cmd.category] === undefined)
                        ret[cmd.category] = [];
                    
                    ret[cmd.category].push(cmd.name);
                };
                cmds.forEach(cmd => add_to_ret(cmd));
                return ret;
            };

            // Given a grouped category + commands, format into an array of field
            const category = (cat, cmds) => {
                const description = cmds.join(", ")
                const category_name = `**— ${category_name_fmt(cat)} —**`;
                return { name: category_name, value: description, inline: true };
            }

            const groups = group_cmd_into_categories(client.commands);
            const keys   = Object.keys(groups);
            const fields = keys.map(key => category(key, groups[key]));

            embed.addFields(...fields)
            return message.channel.send(embed);
    }
    
    function getCMD(client, message, input) {
        const embed = new MessageEmbed()
    
        const cmd = client.commands.get(input.toLowerCase()) || client.commands.get(client.aliases.get(input.toLowerCase()));
        
        let info = `No information found for command **${input.toLowerCase()}**`;
    
        if (!cmd) {
            return message.channel.send(embed.setColor("RANDOM").setDescription(info));
        }
    
        if (cmd.name) info = `**Command name**: ${cmd.name}`;
        if (cmd.aliases) info += `\n**Aliases**: ${cmd.aliases.map(a => `\`${a}\``).join(", ")}`;
        if (cmd.description) info += `\n**Description**: ${cmd.description}`;
        if (cmd.usage) {
            info += `\n**Usage**: ${cmd.usage}`;
            embed.setFooter(`Syntax: <> = required, [] = optional`);
        }
    
        return message.channel.send(embed.setColor("RANDOM").setDescription(info));
    }
  }
  catch (error) {
    await message.channel.send(`\`${error}\`\n You shouldn't see this. Contact alan ✨#1989`)
  }
},
  name: 'help',
  category: 'meta',
  description: 'Help command',
  usage: '`help [command]`'
}
    
    