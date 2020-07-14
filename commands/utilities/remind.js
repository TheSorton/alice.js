
const { clean_everyone, clean_here } = require("../../utils/sanitize.js").sanitize;

module.exports = {
    run: async (client, message, args) => {
        try {
            const Send = (args) => {
                console.log(`${args}`);
            }
            var args = Array.from(args.join(' ').split(" in "))
            var reminder = args[0]
            var time = Array.from(args.slice(1).join(' ').split(' in ').join(' ').split(', ').join(' ').split(' '))
            const objs = [];
            for (let i = 0; i < time.length; i += 2) {
                objs.push({ number: time[i], unit: time[i + 1] });
            }

            var x = [];
            for (let i = 0; i < objs.length; i += 4 ) {
                switch (objs[i].unit) {
                case 'day': 
                    x.push(Number(objs[i].number) * 86400000)
                case 'hour':
                    x.push(Number(objs[i].number) * 3600000)
                case 'minute':
                    x.push(Number(objs[i].number) * 60000)
                case 'second':
                    x.push(Number(objs[i].number) * 1000)
                }}

            const timeout = x.reduce((a, b) => a + b, 0)
            console.log(objs + '\n' + x)
            setTimeout(Send, timeout, reminder);
        }
        catch (error) {
            await message.channel.send(`\`${error}\`\n You shouldn't see this. Contact alan ✨#1989`)
        }
    },
    name: 'remind',
    category: 'utilities',
    args: true,
    aliases: ['remindme'],
    description: 'Reminds you of something',
    usage: '`remind <reminder> in <time>`'
}
