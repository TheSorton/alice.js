import { Message, MessageEmbed } from "discord.js";
import config from '../../../config/config.json';
import bent from 'bent';
import emoji from "node-emoji";
const getJSON = bent('json');


module.exports = {
    name: 'cat',
    category: 'fun',
    description: 'Returns a cat',
    usage: '`a!cat`',
    async run(message: Message, args: string[]) {
      try {
        const noPronouns = (str) => {
          return str.replace(/\b(he|she)\b/gi, (pronoun) => {
            return pronoun.charAt(0) === "h" ? "They" : "they";
          });
        }
        let search = await getJSON(`https://api.thecatapi.com/v1/images/search?limit=1&has_breeds=1&api_key=${config.cat.apikey}`);
          const embed = new MessageEmbed();
          const result = search[0];
          const breed = result.breeds[0];
          const emojiChar = emoji.get( `flag-${breed.country_code.toLowerCase()}`);
          const url = result.url;

          embed.setAuthor(`${breed.name}`);
          embed.addFields(
            { name: "Country", value: `${breed.origin} ${emojiChar}`},
            { name: 'Temperament:', value: `${breed.temperament}`, inline: true},
            { name: 'Description', value: `${noPronouns(breed.description)}`, inline: false }
          );
          embed.setImage(url);

        message.reply(embed);
      }
      catch(error) {
        await message.channel.send(`\`${error}\``);
      }
    }
}
