const configModel = require("../../database/models/server")


module.exports = {
    run: async(client, message, args) => {
        if(!message.member.permissions.has("MANAGE_SERVER")) return message.channel.send(`You can't do that.`)
        let doc = await configModel
        .findOne({ guildID: message.guild.id })
        .catch(err => console.log(err));
        switch(args[0]) {
            case '-log':
                if (!args[1]) await message.reply("Please specify a channel by its ID")
                else {
                    if (doc) {
                            doc.config.logChan = args[1]
                            await doc.save();
                            await message.channel.send('Log channel has been set.')
                            return;
                        }
                }
            case '-welcome':
                if (!args[1]) await message.reply("Please specify a channel by its ID")
                if (doc) {
                        doc.config.welChan = args[1]
                        await doc.save();
                        await message.channel.send('Log channel has been set.')
                        return;
                    }
            case '-mute':
                if (!args[1]) await message.reply("Please specify a role by its ID")

                if (doc) {
                        doc.config.muteRole = args[1]
                        await doc.save();
                        await message.channel.send('Mute role has been set.')
                        return;
                    }

            default: 
                await message.channel.send("What did you want to configure...?")

        }


    },
    name: 'config',
    category: 'utilities',
    args: true,
    description: 'Configure the bot',
    usage: "```markdown\n# Server configuration\n# Flags\n- '-log' – Sets the log channel\n- '-wel' – Sets the welcome/goodbye channel\n- '-mute' – Sets the muted role\n# Usage\nconfig <flag> <id>\n# Examples\nconfig -log 123123123123123\nconfig -wel 123123123123123\nconfig -mute 123123123123123```"
    
}