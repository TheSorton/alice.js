# alice
Multifunctional Discord bot written in node.js.

## Adding to your server
Although the bot is considered "public" by Discord, it's not totally ready for mass deployment. I've only tested it on a total of 3 servers and it seems to work fine.
If you're willing to accept the fact stuff may not work properly, you can use this [link](https://discord.com/api/oauth2/authorize?client_id=576453665171308546&permissions=8&scope=bot) to add it.
It'll say it requires admininstrator for the same reason one may `chmod 777` something. You can take admin away from her and the only thing that *shouldn't* work is the moderation commands and logging. 

## Self-hosting
If you're planning on self-hosting the bot, there are some considerations to make:
- The bot uses [mongodb](https://www.mongodb.com/) for databases. (The database is called `main`)
- It uses several (free) API keys for different calls. This will be explained later.
- It requires a config.json in `./config/`

### config.json
The config.json file is in the following format:
```json
{
    "bot": {
        "token": "your token",
        "prefix": "the bots prefix",
        "owner": "the owner of the bot's ID"
    },
    "lastfm": {
        "apikey": "last.fm api key"
    },
    "google":  {
        "apikey": "google api key",
        "cx": "google custom search engine identifier for images"
    }
}
```
These keys are not required, and the commands will give an error if they're left out.

### Starting
After config.json has been created, make sure to have node.js v12 and npm installed as these are required. Run `npm install` to install the bots dependencies. 
After they are installed, run `npm run start` to start the bot.

## Configuration
For several components, alice will require configuration on the server. Use `<prefix>help config` to see what the different configuration options are.