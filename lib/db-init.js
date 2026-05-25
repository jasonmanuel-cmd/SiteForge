// Database initialization script
// This creates the SQLite database with the schema

const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../prisma/dev.db');
const migrationSQL = fs.readFileSync(
  path.join(__dirname, '../prisma/migrations/20251201075516_init/migration-sqlite.sql'),
  'utf8'
);

// Create database file if it doesn't exist
if (!fs.existsSync(dbPath)) {
  console.log('Creating database...');

  // Install better-sqlite3 if needed
  const { execSync } = require('child_process');
  try {
    require.resolve('better-sqlite3');
  } catch (e) {
    console.log('Installing better-sqlite3...');
    execSync('npm install better-sqlite3', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
  }

  const Database = require('better-sqlite3');
  const db = new Database(dbPath);

  // Execute migration SQL
  const statements = migrationSQL.split(';').filter(s => s.trim());
  for (const statement of statements) {
    if (statement.trim()) {
      try {
        db.exec(statement);
      } catch (err) {
        console.error('Error executing statement:', statement.substring(0, 100) + '...');
        console.error(err.message);
      }
    }
  }

  db.close();
  console.log('Database created successfully!');
} else {
  console.log('Database already exists.');
}
