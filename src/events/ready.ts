import { Events } from 'discord.js';
import { textColor } from '../lib/colors';

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
        console.log(`${textColor.fgCyan}🖥️  https://discordapp.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=0&scope=bot ${textColor.reset}`);
        //console.log('Client is ready!');
    },
};
