import { Kysely, SqliteDatabase } from 'kysely';

export async function up(db: Kysely<SqliteDatabase>) {
    await db.schema
        .createTable('students')
        .ifNotExists()
        .addColumn('id', 'integer', (c) =>
            c.primaryKey().autoIncrement().notNull()
        )
        .addColumn('name', 'text', (c) => c.notNull())
        .addColumn('username', 'text', (c) => c.unique().notNull())
        .execute();
}

export async function down(db: Kysely<SqliteDatabase>) {
    await db.schema.dropTable('students').execute();
}
