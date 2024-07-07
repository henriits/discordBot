import { Client } from 'discord.js';

export async function createChannel(
    botClient: Client | undefined,
    DISCORD_CHANNEL_ID: string | undefined
) {
    if (!botClient) {
        console.warn(
            'Bot is undefined. The channel creation will not be performed.'
        );
        return undefined;
    }
    if (!DISCORD_CHANNEL_ID) {
        console.warn('Discord channel ID is not defined.');
        return undefined;
    }
    const channel = botClient.channels.cache.get(DISCORD_CHANNEL_ID);
    if (!channel) {
        console.warn(`Channel with ID ${DISCORD_CHANNEL_ID} not found.`);
        return undefined;
    }
    console.log(`Channel with ID ${DISCORD_CHANNEL_ID} found.`);
    return channel;
}
