const { MessageEmbed } = require('discord.js');

module.exports = {
    run: async(client, message) => {
        lock = false
        if (lock) await message.reply('No.');
        let args = message.content.slice(6).split(', ');
        if (!args[1]) {
            await message.reply("You need to supply at least 2 choices.")
        }
        var i = 1; 
        const embed = new MessageEmbed()
        .setAuthor(`${message.author.tag} has started a poll. Say %choose <number> to choose.`)
        .setDescription(args.map(x => `\`${i++}. ${x}\``).join('\n'))
        await message.channel.send({embed: embed})


        const filter = m => m.content.includes('%choose');
        const collector = message.channel.createMessageCollector(filter, { time: 10000 });

        collector.on('collect', m => {
            lock = true;
            if (m.author.bot) return;
            let num = m.content.split(' ').slice(1).filter(x => x != '')[0]
            console.log(m.author.username, num)
            if (Number.parseInt(num) <= args.length && Number.parseInt(num) > 0) {
                message.channel.send(num)
                m.delete()
                return;
            }
            else message.channel.send("fuck you")
        });

        collector.on('end', collected => {
            let keys = [ ...collected.keys() ]
            const is_valid_cmd = user_input => {
                return user_input.trimStart().startsWith('%choose ');
            };
            
            const is_valid_vote = user_input => {
                const N = Number.parseInt(user_input);
                return 0 < N && N <= args.length;
            };
            
            const get_vote = user_input => {
                return user_input.split(' ').filter(x => x != '').slice(1)[0];
            };
            
            const messages = keys.reverse().map(k => collected.get(k));
            const choices = messages.filter(msg => is_valid_cmd(msg.content));
            const votes = choices.map(msg => ({
                author: msg.author.id,
                vote: get_vote(msg.content),
                message: msg.id
            })).filter(v => is_valid_vote(v.vote));

            const rmDupe = (array, prop) => {
                var cleanArray = [];
                var lookupObject  = {};
            
                for(var i in array.reverse()) {
                    lookupObject[array[i][prop]] = array[i];
                }
            
                for(i in lookupObject) {
                    cleanArray.push(lookupObject[i]);
                }
                    return cleanArray;
            }


            const max = (score_func, arr) => {
                let max_score = null;
                let max_item = null;
                let ties = [];
                let has_tie = false;
                arr.forEach((item, idx) => {
                    const score = score_func(item);
                    if (max_score == null || score > max_score) {
                        max_score = score;
                        max_item = idx;
                        ties = [idx];
                        has_tie = false;
                    } else if (score == max_score) {
                        ties.push(idx);
                        has_tie = true;
                    }
                });
                return { index: max_item, score: max_score, ties, has_tie };
            };

            cleanVotes = rmDupe(votes, 'author')
            const results = [];
            for (let i = 0; i < args.length; ++i) {
                results[i] = 0;
            }
            cleanVotes.map(v => v.vote).forEach(v => {
                results[v-1] += 1;
            });

            var { index, score, ties, has_tie } = max(x => x, results)
            console.log(index, score, ties, has_tie)

            let i = 1
            let v = 0
            const embed = new MessageEmbed()
            .setAuthor(`The results are in!.`)
            .setDescription(
                args.map(x => `\`${i++}. ${x} -- ${results[v++]} vote(s)\``).join('\n')
                )
            const formatter = new Intl.ListFormat('en', { style: 'long', type: 'conjunction' });
            if (has_tie) embed.addField('Tied', `There was a tie between ${formatter.format(ties.map(v => args[v]))}`)
            else embed.addField('Winner', `The winner is ${args[index]}`)
             message.channel.send({embed: embed})
        });

    },
    name: 'poll',
    category: 'misc',
    description: 'Starts a poll.',
    usage: "`poll <option1>, <option2>, [option3], ...`"
}