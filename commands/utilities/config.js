const configModel = require("../../../database/models/server")


module.exports = {
    run: async(client, message, args) => {
        if(!message.member.permissions.has("MANAGE_SERVER")) return message.channel.send(`You can't do that.`)
        let doc = await configModel
        switch(args[0]) {
            case 'log':


        }


    },
    name: 'config',
    category: 'utilities',
    args: true,
    description: 'Configure the bot'
}