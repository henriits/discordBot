import { Client } from 'discord.js';
import createBot from '../discordBot';

describe('Discord Bot', () => {
    let bot: Client;

    beforeAll(() => {
        const discordBotToken = 'your_discord_bot_token_here';
        bot = createBot(discordBotToken);
    });

    afterAll(async () => {
        await bot.destroy();
    });

    it('should initialize the bot', () => {
        expect(bot).toBeDefined();
        expect(bot).toBeInstanceOf(Client);
    });
});
