import { Kysely, SqliteDatabase, sql } from 'kysely';

export async function up(db: Kysely<SqliteDatabase>) {
    await db.schema
        .createTable('discord_messages')
        .ifNotExists()
        .addColumn('timestamp', 'timestamp', (c) =>
            c.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
        )
        .addColumn('student_id', 'integer', (c) =>
            c.notNull().references('students.id')
        )
        .addColumn('sprint_id', 'integer', (c) =>
            c.notNull().references('sprints.id')
        )
        .addColumn('template_id', 'integer', (c) =>
            c.references('message_templates.id').notNull()
        )
        .addColumn('url', 'text', (c) => c.notNull())
        .execute();
}

export async function down(db: Kysely<SqliteDatabase>) {
    await db.schema.dropTable('discord_messages').execute();
}
