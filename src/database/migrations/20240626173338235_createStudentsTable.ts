import { Kysely, SqliteDatabase } from 'kysely';

export async function up(db: Kysely<SqliteDatabase>) {
    await db.schema
        .createTable('students')
        .addColumn('student_id', 'integer', (col) =>
            col.primaryKey().autoIncrement().notNull()
        )
        .addColumn('userName', 'text', (col) => col.notNull())
        .execute();
}

export async function down(db: Kysely<SqliteDatabase>) {
    await db.schema.dropTable('students').execute();
}
