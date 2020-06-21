const { MessageCollector } = require('discord.js')
const defaultEmoji = require("emoji-name-map");
const messageModel = require("../../../database/models/message")

let msgCollectorFilter = (newMsg, oldMsg) => newMsg.author.id === oldMsg.author.id;

module.exports = {
    run: async(client, message,args) => {
        if (args.length !== 1) {
            let msg = message.reply("You've supplied too many arguments");
            await msg.delete(5000).catch(err => console.log(err));

        }
        else {
            try {
            let fetchedMsg = await message.channel.messages.fetch(args[0]);
            if (fetchedMsg) {
                await message.channel.send("You may now pass all of the emoji names with their respective role names in the following format: `<emoji>, <role>`. One by one.");

                let collector = new MessageCollector(message.channel, msgCollectorFilter.bind(null, message));
                let emojiRoleMap = new Map()
                collector.on('collect', msg => {

                    if (msg.content.toLowerCase() === '%save') {
                        collector.stop('Saved.')
                        return;
                    }

                    var [ emojiName, roleName ] = msg.content.split(/,\s+/);
                    if (!emojiName && !roleName) return;
                    var emoji = msg.guild.emojis.cache.find(emoji => emoji.name.toLowerCase() === emojiName.toLowerCase());
                    if (!emoji) {
                        var emoji = defaultEmoji.get(emojiName)
                        if (!emoji) {
                            msg.channel.send("Emoji doesn't exist")
                            .then(msg => msg.delete({ timeout: 5000 }))
                            return;
                        }
                    }
                    var role = msg.guild.roles.cache.find(role => role.name.toLowerCase() === roleName.toLowerCase());
                    if (!role) {
                        msg.channel.send("Role doesn't exist.")
                        .then(msg => msg.delete({ timeout: 5000 }))
                        return;
                    }

                    fetchedMsg.react(emoji)
                    emojiRoleMap.set(emoji, role.id)
                    message.delete()
                });

                collector.on('end', async (collected, reason) => {
                let findMsgDoc = await messageModel
                    .findOne({ messageID: fetchedMsg.id })
                    .catch(err => console.log(err));
                
                if (findMsgDoc) {
                    message.channel.send("The message you have specified has already been set up.")
                    return;
                }
                else{
                    let dbMsgModel = new messageModel({
                        messageID: fetchedMsg.id,
                        emojiRoleMap: emojiRoleMap
                    });
                    if (findMsgDoc = await messageModel.findOne({ messageID: fetchedMsg.id })) {
                        dbMsgModel.save()
                        .catch(err => console.log(err))
                    }
                    
                    dbMsgModel.save()
                    .catch(err => console.log(err))
                    };
                })
            }
        }
            
        catch(err) {
            console.log(err);
        }}
    },
    name: 'initrolemsg',
    category: 'admin',
    args: true,
    aliases: [],
    description: 'Initalizes a message for reaction roles.'
}