const { Client } = require('discord.js-selfbot-v13');
const Discord = require('discord.js-selfbot-v13');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

const client = new Client({ checkUpdate: false });

// เก็บสถานะล่าสุด
let currentStatus = {};

client.on('ready', () => {
    console.log('Bot ready!');

    setInterval(() => {
        const r = new Discord.RichPresence()
            .setApplicationId('1089666122988650567')
            .setType('STREAMING')
            .setURL('https://zxvc.xyz')
            .setState('zxvxzv')
            .setName('zxvxzv-tools')
            .setDetails('ZXVXZV-TOOLS')
            .setAssetsLargeImage('https://media.discordapp.net/attachments/1089572008473407588/1095028840272765058/creds_pls_discovered_by_aly_on_We_Heart_It.gif')
            .setAssetsLargeText(`Ping Server: ${Math.round(client.ws.ping)} ms`)
            .setAssetsSmallImage('https://media.discordapp.net/attachments/1089572008473407588/1095021266525753504/20230410_232327.jpg')
            .setAssetsSmallText('Bot1')
            .addButton('__ZXVXZV-TOOLS 3$__', 'https://zxvc.xyz/')
            .addButton('__ZXVXZV-SMS-PREMIUM 2$__', 'https://github.com/zxvxzv/ZXVXZV-SMS');

        client.user.setActivity(r);

        // อัปเดตสถานะสำหรับเว็บ
        currentStatus = {
            state: r.state,
            name: r.name,
            details: r.details,
            ping: Math.round(client.ws.ping),
        };
    }, 5000);
});

// API ให้เว็บเรียกดูสถานะ
app.get('/status', (req, res) => {
    res.json(currentStatus);
});

client.login(process.env.DISCORD_TOKEN);

// เริ่ม server ให้เว็บเรียก /status ได้
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
