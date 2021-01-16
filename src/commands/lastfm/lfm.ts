import {Message, MessageEmbed} from 'discord.js';
import aliceClient, { prefix } from '../../lib/aliceClient';
import config from '../../../config/config.json'
import bent from 'bent';
import Enmap from 'enmap';

module.exports = {
  name: 'fm',
  description: 'Get currently playing (or last played) track on last.fm.',
  usage: `say something`,
  async run(message: Message, args: string[], client: aliceClient) {
    const getJSON = bent('json')
    const userData: Enmap = client['userData'];

    const buildEmbed = (embed: MessageEmbed, obj) => {
      let mostRecent = obj.recenttracks.track[0]

      if (mostRecent.artist['#text'].length >= 50) embed.addField('Artist', mostRecent.artist['#text'], true);
      else embed.addField('Artist', mostRecent.artist['#text'], false);

      if (obj.recenttracks.track[0]['@attr']) {
        embed.setAuthor(`${obj.recenttracks['@attr'].user} — Now playing`, message.author.avatarURL(), `https://last.fm/user/${username}`)
      } 
      else {
        embed.setAuthor(`${obj.recenttracks['@attr'].user} – Last played`, message.author.avatarURL(), `https://last.fm/user/${username}`)
      }
      
      embed.setThumbnail(mostRecent.image[3]['#text'])
      embed.addField('Album', mostRecent.album['#text'], true)
      embed.addField('Track', mostRecent.name, false)
      
      return embed;
    };

    if (args[0] === 'set') {
      userData.set(message.author.id, {
        lfmUser: args[1]
      });
      return message.reply(`Last.FM username has been set to ${args[1]}`);
    };
    let username: string = userData.get(message.author.id, 'lfmUser');
    if (username === undefined) {
      return message.reply(`Set your last.fm username using \`${prefix}fm set username\``);
    }
    else {
      let url = `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${config.lastfm.apikey}&format=json`;
      let obj = await getJSON(url);
      let embed = new MessageEmbed();
      return message.reply(buildEmbed(embed, obj));
    };
  },
};
