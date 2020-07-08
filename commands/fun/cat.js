const { MessageEmbed } = require("discord.js")
const tiny = require('tiny-json-http')
var fs = require('fs');
const https = require('https');


module.exports = {
    run: async(client, message, args) => {
        const file = fs.createWriteStream("cat.jpg");
        const request = https.get("https://thiscatdoesnotexist.com", function(response) {
            response.pipe(file);
            message.channel.send({ files: ['cat.jpg'] })
        });


    },
    name: 'cat',
    category: 'fun',
    description: "Returns a cat that doesn't exist.",
}