import 'dotenv/config';
import createDiscordBot from './discord/discordBot';
import createDatabase from './database';
import createApp from './app';

const { DISCORD_BOT_TOKEN, DATABASE_URL, DISCORD_CHANNEL_ID } = process.env;

const PORT = 3002;

if (!DISCORD_BOT_TOKEN) {
    throw new Error(
        'DISCORD_BOT_TOKEN is not defined in the environment variables.'
    );
}

if (!DATABASE_URL) {
    throw new Error(
        'DATABASE_URL is not defined in the environment variables.'
    );
}

if (!DISCORD_CHANNEL_ID) {
    throw new Error(
        'DISCORD_CHANNEL_ID is not defined in the environment variables.'
    );
}

const discordBot = createDiscordBot(DISCORD_BOT_TOKEN);
const database = createDatabase(DATABASE_URL);
const app = createApp(database, discordBot);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
