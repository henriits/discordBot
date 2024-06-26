import * as fs from 'fs';
import * as path from 'path';

const MIGRATIONS_DIR = path.join(__dirname, '../src/database/migrations');
const TIMESTAMP = new Date().toISOString().replace(/[-T:.Z]/g, '');

const migrationName = process.argv[2];
if (!migrationName) {
    console.error('Please provide a name for the migration.');
    process.exit(1);
}

const FILENAME = `${TIMESTAMP}_${migrationName}.ts`;

const CONTENT = `
import { Kysely, SqliteDatabase } from 'kysely';

export async function up(db: Kysely<SqliteDatabase>) {
  // Add your migration up logic here
}

export async function down(db: Kysely<SqliteDatabase>) {
  // Add your migration down logic here
}
`;

if (!fs.existsSync(MIGRATIONS_DIR)) {
    fs.mkdirSync(MIGRATIONS_DIR, { recursive: true });
}

fs.writeFileSync(path.join(MIGRATIONS_DIR, FILENAME), CONTENT.trim(), 'utf8');
console.log(`Created new migration: ${FILENAME}`);
