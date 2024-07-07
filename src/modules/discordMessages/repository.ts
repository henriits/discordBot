import type { Insertable } from 'kysely';
import type { Database, DiscordMessages } from '@/database';
import { keys } from './schema';

type Row = DiscordMessages;
type RowWithoutId = Omit<Row, 'id'>;
type RowInsert = Insertable<RowWithoutId>;

const TABLE = 'discordMessages';
export default (db: Database) => ({
    create: async (record: RowInsert & { url: string }) => {
        await db.transaction().execute(async (trx) => {
            await trx
                .insertInto(TABLE)
                .values(record)
                .returning(keys)
                .executeTakeFirstOrThrow();
        });
    },
    getPostInfo: async (id: number) =>
        db
            .selectFrom(TABLE)
            .innerJoin('students', 'studentId', 'students.id')
            .innerJoin('messageTemplates', 'templateId', 'messageTemplates.id')
            .innerJoin('sprints', 'sprintId', 'sprints.id')
            .select([
                'discordMessages.url',
                'students.name',
                'students.username',
                'sprints.sprintName',
                'sprints.sprintDescription',
                'messageTemplates.text',
            ])
            .where('studentId', '=', id)
            .orderBy('timestamp', 'desc')
            .limit(1)
            .execute(),

    getAllMessages: async () =>
        db
            .selectFrom(TABLE)
            .innerJoin('students', 'studentId', 'students.id')
            .innerJoin('messageTemplates', 'templateId', 'messageTemplates.id')
            .innerJoin('sprints', 'sprintId', 'sprints.id')
            .select([
                'students.username',
                'students.name',
                'sprints.sprintName',
                'messageTemplates.text',
                'discordMessages.url',
            ])
            .execute(),
    getUserMessages: async (username: string) =>
        db
            .selectFrom(TABLE)
            .innerJoin('students', 'studentId', 'students.id')
            .innerJoin('messageTemplates', 'templateId', 'messageTemplates.id')
            .innerJoin('sprints', 'sprintId', 'sprints.id')
            .select([
                'students.name',
                'sprints.sprintName',
                'sprints.sprintDescription',
                'messageTemplates.text',
                'discordMessages.url',
            ])
            .where('students.username', '=', username)
            .execute(),
    getSprintMessages: async (sprint: string) =>
        db
            .selectFrom(TABLE)
            .innerJoin('students', 'studentId', 'students.id')
            .innerJoin('messageTemplates', 'templateId', 'messageTemplates.id')
            .innerJoin('sprints', 'sprintId', 'sprints.id')
            .select([
                'students.name',
                'sprints.sprintName',
                'sprints.sprintDescription',
                'messageTemplates.text',
                'discordMessages.url',
            ])
            .where('sprints.sprintName', '=', sprint)
            .execute(),
});
