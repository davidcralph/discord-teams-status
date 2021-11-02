# discord-teams-status
Sync your Discord status to Microsoft Teams

This is a work-in-progress, and I am not responsible for anything that happens to your Microsoft account from using this utility.

## Installation
*Note: these will be simplified later*
1. Create a new [Discord bot](https://discordpy.readthedocs.io/en/stable/discord.html) and invite it into an **empty server with only you and the bot in it**
2. ``git clone https://github.com/davidcralph/discord-teams-status && cd discord-teams-status`` to clone the repository
3. ``npm i`` or ``yarn`` to install dependencies
4. ``cd src`` then ``mv config-example.json config.json`` and fill out the config. Note that the timeout should be 20000ms (20 seconds) to give you enough time to sign into your Microsoft account. I recommend changing it later to 5000ms (5 seconds) for fast startup
5. ``node index.js`` to start the Discord bot and web browser

## Images
(Spotify)

![Spotify](https://cdn.discordapp.com/attachments/701854785946517558/905119925444706304/unknown.png)

(Custom)

![Custom](https://cdn.discordapp.com/attachments/701854785946517558/905120451154571354/unknown.png)

(Activity)

![Activity](https://cdn.discordapp.com/attachments/701854785946517558/905127851454513262/unknown.png)

## License
[MIT](LICENSE)
