# alice

A multifunctional Discord bot in TypeScript.

![Screenshot of the alice Discord bot running.](https://i.imgur.com/GKKTsxp.png)


## Features

**_Disclaimer:_** As long as you see this, the features listed below may not be implemented.

- General utilities such as searching Google Images, YouTube, Urban Dictionary, MyAnimeList, dice rolls, and more.
- Anything else I can think of

## Adding to your server

Don't. Host it yourself for now.

## Configuration

```json
{
  "bot": {
    "token": "token",
    "owner": "bot owner id",
    "clientId": "bot id"
  },
  "lastfm": {
    "apikey": "last.fm api key"
  },
  "cat": {
    "apikey": "cat api key (https://thecatapi.com)"
  },
  "anilist": {
    "apikey": "anilist api key"
  },
  "google": {
    "apikey": "google api key",
    "cx": "google custom search engine identifier for images"
  }
}
```

in `config/config.json`

# MongoDB

This bot uses MongoDB. It creates a database titled `main` and connects to `mongodb://localhost:27017/alice` which can be seen on line 10. 

This isn't a hard requirement. The bot will work without MonogoDB.
