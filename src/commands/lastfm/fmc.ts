import {Message, MessageEmbed,MessageAttachment} from 'discord.js';
import aliceClient, { prefix } from '../../lib/aliceClient';
import config from '../../../config/config.json'
import fs from 'fs';
import { createCollage } from '@mtblc/image-collage';
import bent from 'bent';
import Enmap from 'enmap';
import { builtinModules } from 'module';

module.exports = {
  name: 'fmc',
  description: 'Get currently playing (or last played) track on last.fm.',
  usage: `say something`,
  async run(message: Message, args: string[], client: aliceClient) {
    const getJSON = bent('json')
    const userData: Enmap = client['userData'];

    const urlBuilder = (username, timespan) => {
      let url = `http://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${username}&period=${timespan}&api_key=${config.lastfm.apikey}&format=json`
      return url;
    }

    const genCollage = (images, username) => {
      const collageWidth = 1000;
      createCollage(images, collageWidth).then((imageBuffer) => {
        fs.writeFileSync("out.png", imageBuffer);

        const file = new MessageAttachment('out.png');

        const embed = new MessageEmbed()
          .setAuthor(username, message.author.avatarURL({ format: "png" }))
          .setImage('attachment://out.png')

        message.reply({ files: [file], embed: embed })
      })
    }
    
    const getAlbums = async (builtURL, username) => {
      message.channel.startTyping();

      let obj = await getJSON(builtURL);
      let covers = [];
      let n = 0
      while (n < 9) {
        console.log(obj.topalbums.album[n].image[3]['#text'])
        if (obj.topalbums.album[n].image[3]['#text'] === undefined) {
          covers.push('https://live.staticflickr.com/3804/8788210204_4b9b45becb.jpg')
          n++;
        }
        else {
          covers.push(obj.topalbums.album[n].image[3]['#text']);
          n++;
        }
      }
      genCollage(covers, username)
      message.channel.stopTyping();
    };
    
    if (!args[0]) {
      let username: string = userData.get(message.author.id, 'lfmUser');
      if (username === undefined) {
        return message.reply(`Set your last.fm username using \`${prefix}fm set username\``);
      }
      let timespan = '7day'
      getAlbums(urlBuilder(username, timespan), username)
      message.channel.stopTyping();

    }
    else {
      await message.reply("Set your username using `fm set [username]` without the brackets.")
      return
    }
  }
};
