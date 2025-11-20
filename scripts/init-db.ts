/**
 * Database initialization script
 * Run with: npx tsx scripts/init-db.ts
 * Or: ts-node scripts/init-db.ts
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { sql } from '../lib/neon';

async function initDatabase() {
  try {
    console.log('Initializing database...');
    
    // Read the schema file
    const schemaPath = join(process.cwd(), 'lib', 'db-schema.sql');
    const schema = readFileSync(schemaPath, 'utf-8');
    
    // Execute the schema (split by semicolons for individual statements)
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    for (const statement of statements) {
      if (statement.trim()) {
        await sql(statement);
        console.log('Executed statement');
      }
    }
    
    console.log('Database initialized successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initDatabase();

