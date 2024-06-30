import { z } from 'zod';
import type { Sprints } from '@/database';

// Ensure the Sprints type matches the schema definition
type Sprint = Sprints;

// Define the schema using zod
const schema = z.object({
    id: z.coerce.number().int().positive(),
    sprintName: z.string().startsWith('WD-', { message: 'Must Start with WD' }),
    sprintDescription: z.string().min(5).max(500),
});

// Define insertable schema (omit id since it's auto-incremented)
const insertable = schema.omit({ id: true });

// Define updatable schema (partial of insertable)
const updatable = insertable.partial();

// Define parsing functions
export const parse = (record: unknown) => schema.parse(record);
export const parseId = (id: unknown) => schema.shape.id.parse(id);
export const parseInsertable = (record: unknown) => insertable.parse(record);
export const parseUpdatable = (record: unknown) => updatable.parse(record);

// Define keys for the schema
export const keys: (keyof Sprint)[] = Object.keys(
    schema.shape
) as (keyof z.infer<typeof schema>)[];
