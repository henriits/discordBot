import { z } from 'zod';
import type { MessageTemplates } from '@/database';

type MessageTemplate = MessageTemplates;
const schema = z.object({
    id: z.coerce.number().int().positive(),
    text: z.string().min(1).max(500),
});

const insertable = schema.omit({ id: true });
const updatable = insertable.partial();

export const parse = (record: unknown) => schema.parse(record);
export const parseId = (id: unknown) => schema.shape.id.parse(id);
export const parseInsertable = (record: unknown) => insertable.parse(record);
export const parseUpdatable = (record: unknown) => updatable.parse(record);

export const keys: (keyof MessageTemplate)[] = Object.keys(
    schema.shape
) as (keyof z.infer<typeof schema>)[];
