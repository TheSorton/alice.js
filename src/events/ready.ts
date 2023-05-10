import { Events } from 'discord.js';

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
        console.log(`https://discordapp.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=0&scope=bot`);
        console.log('Client is ready!');
    },
};
