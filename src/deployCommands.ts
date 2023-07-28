import { textColor } from "./lib/colors";

const { REST, Routes } = require('discord.js');
const config = require("../config/config.json")
const fs = require('fs');
const path = require('path');


const commands = [];
// Grab all the command folders from the commands directory you created earlier
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	// Grab all the command files from the commands directory you created earlier
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));
	// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(`${textColor.fgYellow}[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.${textColor.reset}`);
		}
	}
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(config.bot.token);

// and deploy your commands!
(async () => {
	try {
		console.clear()
		console.log(`${textColor.fgMagenta}` + "\
                                                                              \n\
	 .8.          8 8888          8 8888     ,o888888o.    8 8888888888   	  \n\
        .888.         8 8888          8 8888    8888     `88.  8 8888         \n\
       :88888.        8 8888          8 8888 ,8 8888       `8. 8 8888         \n\
      . `88888.       8 8888          8 8888 88 8888           8 8888         \n\
     .8. `88888.      8 8888          8 8888 88 8888           8 888888888888 \n\
    .8`8. `88888.     8 8888          8 8888 88 8888           8 8888         \n\
   .8' `8. `88888.    8 8888          8 8888 88 8888           8 8888         \n\
  .8'   `8. `88888.   8 8888          8 8888 `8 8888       .8' 8 8888         \n\
 .888888888. `88888.  8 8888          8 8888    8888     ,88'  8 8888         \n\
.8'       `8. `88888. 8 888888888888  8 8888     `8888888P'    8 888888888888 \n\
\n\
			A discord bot\n\
   		")
		console.log(`${textColor.fgBlue}🔄 Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
            Routes.applicationCommands(config.bot.clientId),
			{ body: commands },
		);

		console.log(`✅ Successfully reloaded ${data.length} application (/) commands. ${textColor.reset}`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();