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

    client.login(discordBotToken);

    return client;
}
