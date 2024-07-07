import { Client, GatewayIntentBits } from 'discord.js';

export default function createBot(discordBotToken: string) {
    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
        ],
    });

    client.on('ready', (c) => {
        console.log(`${c.user.tag}  is ready`);
    });

    client.on('messageCreate', (msg) => {
        console.log(msg.content);
        if (msg.author.bot) {
            return; // if bot is message author, return dont reply
        }
        if (msg.content === 'hello') {
            msg.reply('Hey there!');
            msg.react('❤️');
        }
    });

    client.login(discordBotToken);

    return client;
}
