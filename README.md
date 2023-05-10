# alice
A multifunctional Discord bot in TypeScript.

## Features
***Disclaimer:*** As long as you see this, the features listed below may not be implemented.

- Moderation utilities such as banning, kicking, logging, and more.
- General utilities such as searching Google Images, YouTube, Urban Dictionary, MyAnimeList, dice rolls, and more.
- Anything else I can think of

## Adding to your server
Don't. Host it yourself for now. 

## Configuration
```json
{
    "bot": {
        "token": "token",
        "prefix": "prefix",
        "owner": "your id",
        "clientId": "app id"
    },
    "lastfm": {
        "apikey": "last.fm api key"
    },
    "google":  {
        "apikey": "google api key",
        "cx": "google custom search indentifier"
    }

}
```
to `config/config.json`