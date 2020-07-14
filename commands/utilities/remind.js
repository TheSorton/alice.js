
const { clean_everyone, clean_here } = require("../../utils/sanitize.js").sanitize;
var schedule = require('node-schedule');

module.exports = {
    run: async (client, message, args) => {
        try {

            var args = Array.from(args.join(' ').split(" in "))
            var reminder = args[0]
            var time = Array.from(args.slice(1).join(' ').split(' in ').join(' ').split(', ').join(' ').split(' '))
            const objs = [];
            for (let i = 0; i < time.length; i += 2) {
                objs.push({ number: time[i], unit: time[i + 1] });
            }

            var x = [];
            console.log(objs.length)
            for (let i = 0; i < objs.length; i++) {
                if (objs[i].unit === 'day') {
                    x.push(Number(objs[i].number) * 86400000)
                    console.log(objs[i].unit)
                }
                else if (objs[i].unit === 'hour') {
                    x.push(Number(objs[i].number) * 3600000)
                    console.log(objs[i].unit)
                }
                else if (objs[i].unit === 'minute') {
                    x.push(Number(objs[i].number) * 60000)
                    console.log(objs[i].unit)
                }
                else if (objs[i].unit === 'second') {
                    x.push(Number(objs[i].number) * 1000)
                    console.log(objs[i].unit)
                }
            }

            const timeout = x.reduce((a, b) => a + b, 0)
            const schedule = Math.floor(Date.now()) + timeout
            const datetime = new Date(schedule)

            schedule.scheduleJob(schedule, function(){
                message.reply(reminder)
            });
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
