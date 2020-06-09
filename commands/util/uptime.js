const { Command } = require('discord.js-commando');
const discord = require('discord.js');


module.exports = class Stats extends Command {
    constructor(client) {
		super(client, {
			name: 'uptime',
			group: 'util',
			memberName: 'uptime',
			description: "Gives you the bot's uptime."
		});
	}
    run(message) {
    function format(seconds){
        function pad(s){
            return (s < 10 ? '0' : '') + s;
        }
        var hours = Math.floor(seconds / (60*60));
        var minutes = Math.floor(seconds % (60*60) / 60);
        var seconds = Math.floor(seconds % 60);
        
        return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
        }
        
        var uptime = process.uptime();

    message.say(`The bot has been running for ${format(uptime)}`)
    }
};