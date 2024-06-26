/* eslint-disable @typescript-eslint/no-unused-vars */

import 'dotenv/config';
import createDiscordBot from './discordBot';
import createDatabase from './database';
import createApp from './app';

const { DISCORD_BOT_TOKEN } = process.env;
const { DATABASE_URL } = process.env;

const PORT = 3001;

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

const discordBot = createDiscordBot(DISCORD_BOT_TOKEN);
const database = createDatabase(DATABASE_URL);
const app = createApp();

app.listen(PORT, () => {
    console.log(`Server is running on port http:localhost:${PORT}`);
});
