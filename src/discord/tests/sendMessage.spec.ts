import { vi, describe, it, expect } from 'vitest';
import sendMessage, { formatTheMessage } from '../sendMessage';

vi.mock('discord.js', () => ({
    ...vi.importActual('discord.js'),
    TextChannel: vi.fn().mockImplementation(() => ({
        send: vi.fn(),
    })),
}));

describe('sendMessage', () => {
    it('should warn if an invalid channel is provided', async () => {
        console.warn = vi.fn();

        await sendMessage(undefined, []);

        expect(console.warn).toHaveBeenCalledWith(
            'Invalid channel provided for sending messages.'
        );
    });
});

describe('formatTheMessage', () => {
    it('should format the messages correctly', () => {
        const mockRecords = [
            {
                name: 'User1',
                username: 'user1',
                sprintName: 'Sprint A',
                sprintDescription: 'Description for Sprint A',
                text: 'User1 completed Sprint A.',
                url: 'http://example.com/image1.png',
            },
            {
                name: 'User2',
                username: 'user2',
                sprintName: 'Sprint B',
                sprintDescription: 'Description for Sprint B',
                text: 'User2 completed Sprint B.',
                url: 'http://example.com/image2.png',
            },
        ];

        const formattedMessage = formatTheMessage(mockRecords);

        expect(formattedMessage).toBe(
            '@user1 has just completed Sprint A! Description for Sprint A\nUser1 completed Sprint A.\n\n' +
                '@user2 has just completed Sprint B! Description for Sprint B\nUser2 completed Sprint B.'
        );
    });
});
