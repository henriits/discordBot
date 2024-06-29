import { z } from 'zod';
import { Students } from '@/database';

type Student = Students;
const schema = z.object({
    id: z.coerce.number().int().positive(),
    name: z.string().min(5).max(100),
    username: z.string().min(1).max(15).toLowerCase(),
});

const insertable = schema.omit({ id: true });

export const parseInsertable = (record: string) => insertable.parse(record);
export const keys: (keyof Student)[] = Object.keys(
    schema.shape
) as (keyof z.infer<typeof schema>)[];
