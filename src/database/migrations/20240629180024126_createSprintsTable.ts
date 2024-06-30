import { Kysely, SqliteDatabase } from 'kysely';

export async function up(db: Kysely<SqliteDatabase>) {
    await db.schema
        .createTable('sprints')
        .ifNotExists()
        .addColumn('id', 'integer', (c) =>
            c.primaryKey().autoIncrement().notNull()
        )
        .addColumn('sprint_name', 'text', (c) => c.notNull())
        .addColumn('sprint_description', 'text', (c) => c.notNull())
        .execute();
}

export async function down(db: Kysely<SqliteDatabase>) {
    await db.schema.dropTable('sprints').execute();
}
