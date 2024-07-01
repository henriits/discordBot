import { expect } from 'vitest';
import type { Insertable } from 'kysely';
import type { MessageTemplates } from '@/database';

export const templatesFactory = (
    overrides: Partial<Insertable<MessageTemplates>> = {}
): Insertable<MessageTemplates> => ({
    text: 'Great job! Congratulations!!!!',
    ...overrides,
});

export const templatesMatcher = (
    overrides: Partial<Insertable<MessageTemplates>> = {}
) => ({
    id: expect.any(Number),
    ...overrides,
    ...templatesFactory(overrides),
});
