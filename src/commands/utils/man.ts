import { Message, MessageEmbed } from "discord.js";
import bent from 'bent';
const getBuffer = bent('buffer');


module.exports = {
    name: 'man',
    category: 'utils',
    description: 'manpages',
    usage: '`a!man [command]`',
    async run(message: Message, args: string[]) {
      try {
        let search = await getBuffer(`https://www.mankier.com/api/v2/explain/?cols=80&q=${args.join(" ").replace(" ", "+")}`);
        message.reply(`\`\`\`\n${search}\n\`\`\``);
      }
      catch(error) {
        await message.channel.send(`\`${error}\``);
      }
    }
}
