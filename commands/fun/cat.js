const { MessageEmbed } = require("discord.js")
const tiny = require('tiny-json-http')
var fs = require('fs');
const https = require('https');


module.exports = {
  run: async(client, message, args) => {
    try {
      const file = fs.createWriteStream("cat.jpg");
      https.get("https://thiscatdoesnotexist.com", function(response) {
        response.pipe(file);
        message.channel.send({ files: ['cat.jpg'] })
      }).on('error', (e) => {
        message.channel.send(`\`${e}\`\n You shouldn't see this. Contact alan ✨#1989.`)
      })
    }
    catch(error) {
      await message.channel.send(`\`${error}\``)
    }


  },
  name: 'cat',
  category: 'fun',
  description: "Returns a cat that doesn't exist.",
}
