import { expect } from 'vitest';
import type { Insertable } from 'kysely';
import type { Students } from '@/database';

export const studentsFactory = (
    overrides: Partial<Insertable<Students>> = {}
): Insertable<Students> => ({
    name: 'Student Name',
    username: 'username',
    ...overrides,
});

export const studentsMatcher = (
    overrides: Partial<Insertable<Students>> = {}
) => ({
    id: expect.any(Number),
    ...overrides,
    ...studentsFactory(overrides),
});
