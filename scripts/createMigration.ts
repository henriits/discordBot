// npm run create-migration -- createDiscordMessage
import * as fs from 'fs';
import * as path from 'path';

const MIGRATIONS_DIR = path.join(__dirname, '../src/database/migrations');
const TIMESTAMP = new Date().toISOString().replace(/[-T:.Z]/g, '');

export default function createMigration(migrationName: string) {
    if (!migrationName) {
        throw new Error('Please provide a name for the migration.');
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

    fs.writeFileSync(
        path.join(MIGRATIONS_DIR, FILENAME),
        CONTENT.trim(),
        'utf8'
    );
    console.log(`Created new migration: ${FILENAME}`);
}

// Execute migration creation if script is run directly
if (require.main === module) {
    const migrationName = process.argv[2];
    createMigration(migrationName);
}
