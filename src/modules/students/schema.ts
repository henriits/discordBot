import { z } from 'zod';
import { Students } from '@/database';

type Student = Students;
const schema = z.object({
    id: z.coerce.number().int().positive(),
    name: z.string().min(1).max(100),
    username: z.string().min(1).max(15).toLowerCase(),
});

const insertable = schema.omit({ id: true });
const updatable = insertable.partial();
export const parse = (record: unknown) => schema.parse(record);
export const parseId = (id: unknown) => schema.shape.id.parse(id);
export const parseInsertable = (record: unknown) => insertable.parse(record);
export const parseUpdatable = (record: unknown) => updatable.parse(record);

export const keys: (keyof Student)[] = Object.keys(
    schema.shape
) as (keyof z.infer<typeof schema>)[];
