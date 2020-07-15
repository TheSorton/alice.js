var schedule = require('node-schedule');

const { clean_everyone, clean_here } = require("../../utils/sanitize.js").sanitize;
const RemindModel = require("../../database/models/reminder");

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
            for (let i = 0; i < objs.length; i++) {
                if (objs[i].unit === 'day') {
                    x.push(Number(objs[i].number) * 86400000)
                }
                else if (objs[i].unit === 'hour') {
                    x.push(Number(objs[i].number) * 3600000)
                }
                else if (objs[i].unit === 'minute') {
                    x.push(Number(objs[i].number) * 60000)
                }
                else if (objs[i].unit === 'second') {
                    x.push(Number(objs[i].number) * 1000)
                }
            }

            const timeout = x.reduce((a, b) => a + b, 0)
            const date = Math.floor(Date.now())
            const ttr = Math.floor(Date.now()) + timeout
            const datetime = new Date(ttr)

            let dbRemindModel = new RemindModel({
                userID: message.author.id,
                reminder: {
                    text: reminder,
                    created: date,
                    ttr: datetime
                }
            });

            dbRemindModel.save()
            .catch(err => console.log(err))
            .then(message.reply('reminder has been set.'))


            schedule.scheduleJob(datetime, function(){
                message.author.send(reminder)

                RemindModel.findOneAndDelete({
                    userID: message.author.id,
                }).catch(err => console.log(err))
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
