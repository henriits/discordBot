import { expect } from 'vitest';
import type { Insertable } from 'kysely';
import type { Sprints } from '@/database';

export const sprintsFactory = (
    overrides: Partial<Insertable<Sprints>> = {}
): Insertable<Sprints> => ({
    sprintName: 'WD-1.1',
    sprintDescription: 'basics with python',
    ...overrides,
});

export const sprintsMatcher = (
    overrides: Partial<Insertable<Sprints>> = {}
) => ({
    id: expect.any(Number),
    ...overrides,
    ...sprintsFactory(overrides),
});
