import { Kysely, SqliteDatabase } from 'kysely';

export async function up(db: Kysely<SqliteDatabase>) {
    await db.schema
        .createTable('message_templates')
        .ifNotExists()
        .addColumn('id', 'integer', (c) =>
            c.primaryKey().autoIncrement().notNull()
        )
        .addColumn('text', 'text', (c) => c.unique().notNull())
        .execute();
}

export async function down(db: Kysely<SqliteDatabase>) {
    await db.schema.dropTable('message_templates').execute();
}
