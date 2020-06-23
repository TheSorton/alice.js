const config = require('../../config/config.json')

module.exports = {
    run: async(client, message, args) => {
        
        const responses = ["It is certain", "It is decidedly so", "Without a doubt", "Yes definitely",
        "You may rely on it", "As I see it yes", "Most likely", "Outlook good", "Yes",
        "Signs point to yes", "Reply hazy. Try again", "Ask again later",
        "Better not tell you now", "Cannot predict now", "Concentrate and ask again",
        "No comment", "Don't count on it", "My reply is no", "My sources say no",
        "Outlook not so good", "Very doubtful", "Not as I see it", "No. Never", "Absolutely not",
        "I doubt it", "What the fuck...?", "¯\\_(ツ)_/¯"]

        if (!args[0]) {
            await message.reply(`You didn't ask a question.`)
            return;
        }
        await message.reply(responses[Math.floor(Math.random() * responses.length)])
    },
    name: 'ask',
    category: 'misc',
    args: true,
    aliases:['ball', '8ball'],
    description: 'Ask alice something',
    usage: '`ask <question>`'
}