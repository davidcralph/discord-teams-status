const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const Discord = require('discord.js');
const client = new Discord.Client();
const axios = require('axios');
const progressbar = require('string-progressbar');

const config = require('./config.json');

puppeteer.use(StealthPlugin());

const getTimeFormatted = (time) => {
    return ('00' + time).slice(-2);
}

let token;
const doStuff = async () => {
    const browser = await puppeteer.launch({
        userDataDir: './user_data',
        headless: false
    });
    const page = await browser.newPage();
    await page.goto('https://teams.microsoft.com');
    await page.waitFor(config.timeout);
    const data = await page.evaluate(() => {
        let check = true;
        let presenceToken;
        Object.keys(localStorage).forEach((key) => {
            if (check === false) {
                return;
            }
            if (key.includes('presence')) {
                const item = localStorage.getItem(key);
                const info = JSON.parse(item);
                presenceToken = info.token;
                check = false;
            }
        });
        return presenceToken;
    });

    token = data;
    await page.close();
    await browser.close();
    console.log('Logged in successfully');

    const setStatus = async () => {
        client.guilds.cache.forEach(async (guild) => {
            guild.members.cache.forEach((member) => {
                let message;
                let expire;
                const status = member.user.presence.status;
    
                if (member.user.bot || status === 'offline') {
                    return;
                }
    
                const activity = member.user.presence.activities[0];
    
                if (!activity) {
                    return;
                }
                
                // music
                if (activity.name === 'Spotify') {
                    const startDate = new Date(activity.timestamps.start);
                    const endDate = new Date(activity.timestamps.end);
                    const length = new Date(endDate - startDate);
                    const current = new Date(new Date() - startDate);
                    const currentPercent = Math.round(((new Date() - startDate) / (endDate - startDate)) * 100);
    
                    message = `Listening to ${activity.details} by ${activity.state}
    ${getTimeFormatted(current.getMinutes())}:${getTimeFormatted(current.getSeconds())}${progressbar.filledBar(100, currentPercent, 20)[0]}${getTimeFormatted(length.getMinutes())}:${getTimeFormatted(length.getSeconds())}
                    `;
                    expire = endDate;
                } else if (activity.name === 'Custom Status') {
                    const emote = activity.emoji ? activity.emoji.name : '';
                    message = `${emote} ${activity.state}`;
                } else {
                    const elapsed = new Date(new Date() - activity.timestamps.start);
                    message = `Playing ${activity.name} (${activity.details}) (${activity.state}) ${getTimeFormatted(elapsed.getMinutes())}:${getTimeFormatted(elapsed.getSeconds())} elapsed`;
                }
    
                  const config = {
                    method: 'PUT',
                    url: 'https://presence.teams.microsoft.com/v1/me/publishnote',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify({
                        expiry: expire,
                        message: message + '<pinnednote></pinnednote>'
                    })
                  };
                
                  axios(config)
                    .then(() => console.log('Posted successfully'))
                    .catch((error) =>  console.log(error));
            });
        });
    }

    client.on('ready', async (client) => {
        await setStatus(client);
        setInterval(async () => {
            try {
                await setStatus(client);
            } catch (e) { }
        }, 15000);
    });
    
    client.login(config.discord_token);
}

doStuff();
