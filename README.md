# alice
A multifunctional Discord bot in TypeScript.

## Features
***Disclaimer:*** As long as you see this, the features listed below may not be implemented. I'm writing everything from scratch. 

- Moderation utilities such as banning, kicking, logging, and more.
- General utilities such as searching Google Images, YouTube, Urban Dictionary, MyAnimeList, dice rolls, and more.
- Anything else I can think of

## Adding to your server
Don't. Host it yourself for now. 

## Configuration
Copy `config/config.example.json` to `config/config.json` and fill it out.

## Writing Commands
Commands are in `src/commands/` and each subdir acts as the command's category. 

The basic boilerplate is as follows:
```ts
/* Imports */

module.exports = {
  name: 'say',                          // Name of command (required)
  description: 'A basic say command.',  // Description of command (required)
  category: 'utilities',                // Category of command (currently unused)
  usage: `${prefix}say something`,      // Usage of command (optional)
  argsRequired: true,                   // If args are required (optional)
  guildOnly: false,                     // If the command should only be allowed in the server (optional)
  ownerOnly: false,                     // If the command should only be used by the bot's owner (optional)
  adminRequired: false,                 // If the command should required Adminstrator perms (optional)
  cooldown: 30                          // Cooldown in seconds (optional)
  /* 
    run(message: Discord.Message, args?: string[], client?: aliceClient)
    aliceClient extends Discord.Client. It adds the command map and enmaps found in src/alice.ts.
  */
  run(message: Message, args: string[] ) {
    // Code here
    message.reply(args.join(' '))
  },
};
```
