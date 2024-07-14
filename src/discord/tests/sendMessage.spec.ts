import { vi, describe, it, expect } from 'vitest';
import sendMessage, { formatTheMessage } from '../sendMessage';

describe('sendMessage', () => {
    it('should warn for an invalid channel', async () => {
        console.warn = vi.fn();

        await sendMessage(undefined, []);

        expect(console.warn).toHaveBeenCalledWith(
            'Invalid channel provided for sending messages.'
        );
    });
});

describe('formatTheMessage', () => {
    it('should format messages correctly', () => {
        const records = [
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

        const formattedMessage = formatTheMessage(records);

        expect(formattedMessage).toBe(
            '@user1 has just completed Sprint A! Description for Sprint A\nUser1 completed Sprint A.\n\n' +
                '@user2 has just completed Sprint B! Description for Sprint B\nUser2 completed Sprint B.'
        );
    });
});
