import { Insertable, Updateable, Selectable, sql } from 'kysely';
import { Database, MessageTemplates } from '@/database';
import { keys } from './schema';

const TABLE = 'messageTemplates';
type Row = MessageTemplates;
type RowWithoutId = Omit<Row, 'id'>;
type RowInsert = Insertable<RowWithoutId>;
type RowUpdate = Updateable<RowWithoutId>;
type RowSelect = Selectable<Row>;

export default (db: Database) => ({
    findAll(): Promise<RowSelect[]> {
        return db.selectFrom(TABLE).select(keys).execute();
    },
    findById(id: number): Promise<RowSelect | undefined> {
        return db
            .selectFrom(TABLE)
            .select(keys)
            .where('id', '=', id)
            .executeTakeFirst();
    },
    addMessage(record: RowInsert): Promise<RowSelect | undefined> {
        return db
            .insertInto(TABLE)
            .values(record)
            .returning(keys)
            .executeTakeFirst();
    },
    update(id: number, partial: RowUpdate): Promise<RowSelect | undefined> {
        if (Object.keys(partial).length === 0) {
            // @ts-ignore
            return this.findById(id);
        }
        return db
            .updateTable(TABLE)
            .set(partial)
            .where('id', '=', id)
            .returning(keys)
            .executeTakeFirst();
    },
    async remove(id: number) {
        // Had to remove from messages, to allow message deletion
        await db
            .deleteFrom('discordMessages')
            .where('templateId', '=', id)
            .execute();

        console.log(`Attempting to remove template with id: ${id}`);
        return db
            .deleteFrom(TABLE)
            .where('id', '=', id)
            .returning(keys)
            .executeTakeFirst()
            .then((result) => {
                console.log('Delete result:', result);
                return result;
            });
    },
    findRandomId(): Promise<{ id: number } | undefined> {
        return db
            .selectFrom(TABLE)
            .select(['id'])
            .orderBy(sql`random()`)
            .limit(1)
            .executeTakeFirst();
    },
});
