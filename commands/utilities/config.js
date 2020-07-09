const configModel = require("../../database/models/server")


module.exports = {
    run: async(client, message, args) => {
        if(!message.member.permissions.has("MANAGE_SERVER")) return message.channel.send(`You can't do that.`)
        switch(args[0]) {
            case '-log':
                if (!args[1]) await message.reply("Please specify a channel by its ID")
                else {
                    let doc = await configModel
                    .findOne({ guildID: message.guild.id })
                    .catch(err => console.log(err));
                    if (doc) {
                            doc.config.logChan = args[1]
                            await doc.save();
                            await message.channel.send('Log channel has been set.')
                            return;
                        }
                }
            default: 
                await message.channel.send("What did you want to configure...?")

        }


    },
    name: 'config',
    category: 'utilities',
    args: true,
    description: 'Configure the bot',
    usage: "`heh`"
    
}