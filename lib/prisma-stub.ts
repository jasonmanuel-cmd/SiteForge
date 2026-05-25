// Prisma Client Stub - Works around Prisma engine download issues
// This uses better-sqlite3 directly instead of Prisma's engines

import Database from 'better-sqlite3';
import path from 'path';
import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';

const dbPath = process.env.DATABASE_URL
  ? (process.env.DATABASE_URL.startsWith('file:') ? process.env.DATABASE_URL.slice(5) : process.env.DATABASE_URL)
  : '/tmp/siteforge.db';

function ensureSchema(db: any) {
  const count = db.prepare("SELECT count(*) as c FROM sqlite_master WHERE type='table' AND name='accounts'").get() as any;
  if (count.c > 0) return;

  db.exec(`
    CREATE TABLE accounts (id TEXT PRIMARY KEY, companyName TEXT NOT NULL, planType TEXT DEFAULT 'trial', status TEXT DEFAULT 'active', createdAt DATETIME, updatedAt DATETIME, qbRealmId TEXT UNIQUE, qbAccessToken TEXT, qbRefreshToken TEXT, qbTokenExpiry DATETIME, emailProvider TEXT, emailAccessToken TEXT, emailRefreshToken TEXT, emailTokenExpiry DATETIME);
    CREATE TABLE users (id TEXT PRIMARY KEY, accountId TEXT NOT NULL, email TEXT UNIQUE NOT NULL, passwordHash TEXT NOT NULL, firstName TEXT NOT NULL, lastName TEXT NOT NULL, role TEXT NOT NULL, phoneNumber TEXT, isActive INTEGER DEFAULT 1, createdAt DATETIME, updatedAt DATETIME, FOREIGN KEY (accountId) REFERENCES accounts(id));
    CREATE TABLE projects (id TEXT PRIMARY KEY, accountId TEXT NOT NULL, name TEXT NOT NULL, address TEXT, city TEXT, state TEXT, zipCode TEXT, status TEXT DEFAULT 'active', startDate DATETIME, endDate DATETIME, estimatedBudget REAL, actualCost REAL DEFAULT 0, qbJobId TEXT, qbClassName TEXT, createdAt DATETIME, updatedAt DATETIME, FOREIGN KEY (accountId) REFERENCES accounts(id));
    CREATE TABLE contacts (id TEXT PRIMARY KEY, accountId TEXT NOT NULL, type TEXT NOT NULL, companyName TEXT, firstName TEXT NOT NULL, lastName TEXT NOT NULL, email TEXT, phoneNumber TEXT, role TEXT, notes TEXT, createdAt DATETIME, updatedAt DATETIME, FOREIGN KEY (accountId) REFERENCES accounts(id));
    CREATE TABLE rfis (id TEXT PRIMARY KEY, accountId TEXT NOT NULL, projectId TEXT NOT NULL, rfiNumber TEXT NOT NULL, subject TEXT NOT NULL, question TEXT NOT NULL, response TEXT, status TEXT DEFAULT 'draft', priority TEXT DEFAULT 'normal', fromContactId TEXT, toContactId TEXT, dueDate DATETIME, sentDate DATETIME, responseDate DATETIME, createdById TEXT NOT NULL, createdAt DATETIME, updatedAt DATETIME, aiGenerated INTEGER DEFAULT 0, aiConfidence REAL, sourceEmailId TEXT);
    CREATE TABLE change_orders (id TEXT PRIMARY KEY, accountId TEXT NOT NULL, projectId TEXT NOT NULL, coNumber TEXT NOT NULL, title TEXT NOT NULL, description TEXT NOT NULL, reason TEXT, status TEXT DEFAULT 'draft', priceImpact REAL DEFAULT 0, scheduleImpact INTEGER DEFAULT 0, contactId TEXT, submittedDate DATETIME, approvedDate DATETIME, rejectedDate DATETIME, rejectionReason TEXT, createdById TEXT NOT NULL, createdAt DATETIME, updatedAt DATETIME, aiGenerated INTEGER DEFAULT 0, aiConfidence REAL, sourceEmailId TEXT);
    CREATE TABLE invoices (id TEXT PRIMARY KEY, accountId TEXT NOT NULL, projectId TEXT NOT NULL, vendorId TEXT, invoiceNumber TEXT, invoiceDate DATETIME, dueDate DATETIME, subtotal REAL DEFAULT 0, tax REAL DEFAULT 0, total REAL DEFAULT 0, status TEXT DEFAULT 'pending', category TEXT, costCode TEXT, qbTxnId TEXT UNIQUE, qbSyncedAt DATETIME, isMultiJob INTEGER DEFAULT 0, allocations TEXT, notes TEXT, createdAt DATETIME, updatedAt DATETIME, aiExtracted INTEGER DEFAULT 0, aiConfidence REAL, rawExtraction TEXT);
    CREATE TABLE invoice_line_items (id TEXT PRIMARY KEY, invoiceId TEXT NOT NULL, description TEXT NOT NULL, quantity REAL NOT NULL, unitPrice REAL NOT NULL, amount REAL NOT NULL, category TEXT);
    CREATE TABLE daily_reports (id TEXT PRIMARY KEY, accountId TEXT NOT NULL, projectId TEXT NOT NULL, reportDate DATETIME NOT NULL, weatherAM TEXT, weatherPM TEXT, temperature TEXT, workPerformed TEXT, laborSummary TEXT, equipmentUsed TEXT, deliveries TEXT, delays TEXT, safetyIssues TEXT, photos TEXT, createdById TEXT NOT NULL, createdAt DATETIME, updatedAt DATETIME, voiceRecorded INTEGER DEFAULT 0, transcriptId TEXT);
    CREATE TABLE files (id TEXT PRIMARY KEY, accountId TEXT NOT NULL, projectId TEXT, fileName TEXT NOT NULL, fileType TEXT NOT NULL, mimeType TEXT NOT NULL, fileSize INTEGER NOT NULL, storagePath TEXT NOT NULL, storageUrl TEXT, linkedEntityType TEXT, linkedEntityId TEXT, uploadedAt DATETIME);
    CREATE TABLE ai_events (id TEXT PRIMARY KEY, accountId TEXT NOT NULL, eventType TEXT NOT NULL, status TEXT DEFAULT 'processing', rawInput TEXT NOT NULL, aiProvider TEXT, aiModel TEXT, aiPrompt TEXT, aiResponse TEXT, aiConfidence REAL, createdEntityType TEXT, createdEntityId TEXT, processingTime INTEGER, errorMessage TEXT, createdAt DATETIME, completedAt DATETIME);
  `);

  const now = new Date().toISOString();
  const accId = randomUUID();
  const userId = randomUUID();
  const pwHash = bcrypt.hashSync('coaijay1989', 10);

  db.prepare("INSERT INTO accounts (id, companyName, planType, status, createdAt, updatedAt) VALUES (?, 'SiteForge Demo Co.', 'pro', 'active', ?, ?)").run(accId, now, now);
  db.prepare("INSERT INTO users (id, accountId, email, passwordHash, firstName, lastName, role, phoneNumber, isActive, createdAt, updatedAt) VALUES (?, ?, ?, ?, 'Jason', 'Manuel', 'owner', '+1-555-0100', 1, ?, ?)").run(userId, accId, 'blunts954@gmail.com', pwHash, now, now);
}

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
ensureSchema(db);

// Helper to convert SQLite rows to objects with proper types
function parseRow(row: any) {
  if (!row) return null;
  const parsed: any = {};
  for (const key in row) {
    const value = row[key];
    // Convert SQLite INTEGER booleans back to JS booleans
    if (value === 0 || value === 1) {
      // Check if field name suggests boolean
      if (key.toLowerCase().includes('is') || key.toLowerCase().includes('active') ||
          key.toLowerCase().includes('generated') || key.toLowerCase().includes('extracted') ||
          key.toLowerCase().includes('recorded') || key.toLowerCase().includes('multi')) {
        parsed[key] = value === 1;
        continue;
      }
    }
    // Try to parse JSON strings
    if (typeof value === 'string' && (value.startsWith('{') || value.startsWith('['))) {
      try {
        parsed[key] = JSON.parse(value);
        continue;
      } catch (e) {
        // Not JSON, keep as string
      }
    }
    // Parse ISO dates
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
      parsed[key] = new Date(value);
      continue;
    }
    parsed[key] = value;
  }
  return parsed;
}

// Create a minimal Prisma-like client
export const prismaClient = {
  account: {
    findUnique: (args: any) => {
      const stmt = db.prepare('SELECT * FROM accounts WHERE id = ?');
      return parseRow(stmt.get(args.where.id));
    },
    findFirst: (args: any) => {
      const where = args.where || {};
      let query = 'SELECT * FROM accounts';
      const params: any[] = [];

      if (Object.keys(where).length > 0) {
        const conditions = Object.keys(where).map(key => {
          params.push(where[key]);
          return `${key} = ?`;
        });
        query += ` WHERE ${conditions.join(' AND ')}`;
      }
      query += ' LIMIT 1';

      const stmt = db.prepare(query);
      return parseRow(stmt.get(...params));
    },
    create: (args: any) => {
      const data = {
        id: randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...args.data,
      };
      const keys = Object.keys(data);
      const values = keys.map(k => data[k]);
      const placeholders = keys.map(() => '?').join(', ');

      const stmt = db.prepare(
        `INSERT INTO accounts (${keys.join(', ')}) VALUES (${placeholders})`
      );
      stmt.run(...values);

      return parseRow(data);
    },
    update: (args: any) => {
      const data = args.data;
      const where = args.where;
      const keys = Object.keys(data);
      const setClause = keys.map(k => `${k} = ?`).join(', ');
      const values = [...keys.map(k => data[k]), where.id];

      const stmt = db.prepare(
        `UPDATE accounts SET ${setClause}, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`
      );
      stmt.run(values);

      return (this as any).findUnique({ where }) ?? null;
    },
  },
  user: {
    findUnique: (args: any) => {
      const where = args.where;
      let query = 'SELECT * FROM users WHERE ';
      let value;

      if (where.id) {
        query += 'id = ?';
        value = where.id;
      } else if (where.email) {
        query += 'email = ?';
        value = where.email;
      }

      const stmt = db.prepare(query);
      return parseRow(stmt.get(value));
    },
    findFirst: (args: any) => {
      const where = args.where || {};
      let query = 'SELECT * FROM users';
      const params: any[] = [];

      if (Object.keys(where).length > 0) {
        const conditions = Object.keys(where).map(key => {
          params.push(where[key]);
          return `${key} = ?`;
        });
        query += ` WHERE ${conditions.join(' AND ')}`;
      }
      query += ' LIMIT 1';

      const stmt = db.prepare(query);
      return parseRow(stmt.get(...params));
    },
    create: (args: any) => {
      const data = {
        id: randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...args.data,
      };
      const keys = Object.keys(data);
      const values = keys.map(k => typeof data[k] === 'boolean' ? (data[k] ? 1 : 0) : data[k]);
      const placeholders = keys.map(() => '?').join(', ');

      const stmt = db.prepare(
        `INSERT INTO users (${keys.join(', ')}) VALUES (${placeholders})`
      );
      stmt.run(...values);

      return parseRow(data);
    },
    findMany: (args: any = {}) => {
      const where = args.where || {};
      let query = 'SELECT * FROM users';
      const params: any[] = [];

      if (Object.keys(where).length > 0) {
        const conditions = Object.keys(where).map(key => {
          params.push(where[key]);
          return `${key} = ?`;
        });
        query += ` WHERE ${conditions.join(' AND ')}`;
      }

      const stmt = db.prepare(query);
      return stmt.all(...params).map(parseRow);
    },
  },
  project: {
    findMany: (args: any = {}) => {
      const where = args.where || {};
      let query = 'SELECT * FROM projects';
      const params: any[] = [];

      if (Object.keys(where).length > 0) {
        const conditions = Object.keys(where).map(key => {
          params.push(where[key]);
          return `${key} = ?`;
        });
        query += ` WHERE ${conditions.join(' AND ')}`;
      }

      const stmt = db.prepare(query);
      return stmt.all(...params).map(parseRow);
    },
    findUnique: (args: any) => {
      const stmt = db.prepare('SELECT * FROM projects WHERE id = ?');
      return parseRow(stmt.get(args.where.id));
    },
    create: (args: any) => {
      const data = args.data;
      const keys = Object.keys(data);
      const values = keys.map(k => data[k]);
      const placeholders = keys.map(() => '?').join(', ');

      const stmt = db.prepare(
        `INSERT INTO projects (${keys.join(', ')}) VALUES (${placeholders})`
      );
      stmt.run(...values);

      return parseRow(data);
    },
  },
  contact: {
    findMany: (args: any = {}) => {
      const where = args.where || {};
      let query = 'SELECT * FROM contacts';
      const params: any[] = [];

      if (Object.keys(where).length > 0) {
        const conditions = Object.keys(where).map(key => {
          params.push(where[key]);
          return `${key} = ?`;
        });
        query += ` WHERE ${conditions.join(' AND ')}`;
      }

      const stmt = db.prepare(query);
      return stmt.all(...params).map(parseRow);
    },
  },
  rFI: {
    findMany: (args: any = {}) => {
      const where = args.where || {};
      let query = 'SELECT * FROM rfis';
      const params: any[] = [];

      if (Object.keys(where).length > 0) {
        const conditions = Object.keys(where).map(key => {
          params.push(where[key]);
          return `${key} = ?`;
        });
        query += ` WHERE ${conditions.join(' AND ')}`;
      }

      const stmt = db.prepare(query);
      return stmt.all(...params).map(parseRow);
    },
    create: (args: any) => {
      const data = args.data;
      const keys = Object.keys(data);
      const values = keys.map(k => typeof data[k] === 'boolean' ? (data[k] ? 1 : 0) : data[k]);
      const placeholders = keys.map(() => '?').join(', ');

      const stmt = db.prepare(
        `INSERT INTO rfis (${keys.join(', ')}) VALUES (${placeholders})`
      );
      stmt.run(...values);

      return parseRow(data);
    },
  },
  changeOrder: {
    findMany: (args: any = {}) => {
      const where = args.where || {};
      let query = 'SELECT * FROM change_orders';
      const params: any[] = [];

      if (Object.keys(where).length > 0) {
        const conditions = Object.keys(where).map(key => {
          params.push(where[key]);
          return `${key} = ?`;
        });
        query += ` WHERE ${conditions.join(' AND ')}`;
      }

      const stmt = db.prepare(query);
      return stmt.all(...params).map(parseRow);
    },
    create: (args: any) => {
      const data = args.data;
      const keys = Object.keys(data);
      const values = keys.map(k => typeof data[k] === 'boolean' ? (data[k] ? 1 : 0) : data[k]);
      const placeholders = keys.map(() => '?').join(', ');

      const stmt = db.prepare(
        `INSERT INTO change_orders (${keys.join(', ')}) VALUES (${placeholders})`
      );
      stmt.run(...values);

      return parseRow(data);
    },
  },
  invoice: {
    findMany: (args: any = {}) => {
      const where = args.where || {};
      let query = 'SELECT * FROM invoices';
      const params: any[] = [];

      if (Object.keys(where).length > 0) {
        const conditions = Object.keys(where).map(key => {
          params.push(where[key]);
          return `${key} = ?`;
        });
        query += ` WHERE ${conditions.join(' AND ')}`;
      }

      const stmt = db.prepare(query);
      return stmt.all(...params).map(parseRow);
    },
    create: (args: any) => {
      const data = args.data;
      const keys = Object.keys(data);
      const values = keys.map(k => {
        if (typeof data[k] === 'boolean') return data[k] ? 1 : 0;
        if (typeof data[k] === 'object') return JSON.stringify(data[k]);
        return data[k];
      });
      const placeholders = keys.map(() => '?').join(', ');

      const stmt = db.prepare(
        `INSERT INTO invoices (${keys.join(', ')}) VALUES (${placeholders})`
      );
      stmt.run(...values);

      return parseRow(data);
    },
  },
  invoiceLineItem: {
    findMany: (args: any = {}) => {
      const where = args.where || {};
      let query = 'SELECT * FROM invoice_line_items';
      const params: any[] = [];

      if (Object.keys(where).length > 0) {
        const conditions = Object.keys(where).map(key => {
          params.push(where[key]);
          return `${key} = ?`;
        });
        query += ` WHERE ${conditions.join(' AND ')}`;
      }

      const stmt = db.prepare(query);
      return stmt.all(...params).map(parseRow);
    },
  },
  dailyReport: {
    findMany: (args: any = {}) => {
      const where = args.where || {};
      let query = 'SELECT * FROM daily_reports';
      const params: any[] = [];

      if (Object.keys(where).length > 0) {
        const conditions = Object.keys(where).map(key => {
          params.push(where[key]);
          return `${key} = ?`;
        });
        query += ` WHERE ${conditions.join(' AND ')}`;
      }

      const stmt = db.prepare(query);
      return stmt.all(...params).map(parseRow);
    },
    create: (args: any) => {
      const data = args.data;
      const keys = Object.keys(data);
      const values = keys.map(k => {
        if (typeof data[k] === 'boolean') return data[k] ? 1 : 0;
        if (typeof data[k] === 'object' && data[k] !== null) return JSON.stringify(data[k]);
        return data[k];
      });
      const placeholders = keys.map(() => '?').join(', ');

      const stmt = db.prepare(
        `INSERT INTO daily_reports (${keys.join(', ')}) VALUES (${placeholders})`
      );
      stmt.run(...values);

      return parseRow(data);
    },
  },
  file: {
    findMany: (args: any = {}) => {
      const where = args.where || {};
      let query = 'SELECT * FROM files';
      const params: any[] = [];

      if (Object.keys(where).length > 0) {
        const conditions = Object.keys(where).map(key => {
          params.push(where[key]);
          return `${key} = ?`;
        });
        query += ` WHERE ${conditions.join(' AND ')}`;
      }

      const stmt = db.prepare(query);
      return stmt.all(...params).map(parseRow);
    },
  },
  aIEvent: {
    create: (args: any) => {
      const data = args.data;
      const keys = Object.keys(data);
      const values = keys.map(k => {
        if (typeof data[k] === 'object' && data[k] !== null) return JSON.stringify(data[k]);
        return data[k];
      });
      const placeholders = keys.map(() => '?').join(', ');

      const stmt = db.prepare(
        `INSERT INTO ai_events (${keys.join(', ')}) VALUES (${placeholders})`
      );
      stmt.run(...values);

      return parseRow(data);
    },
  },
  $disconnect: async () => {
    db.close();
  },
  $transaction: async (callback: any) => {
    // Simple transaction support - SQLite in better-sqlite3 is transactional by default
    // We'll just execute the callback with the same client
    // In a real implementation, you'd want to use db.transaction()
    try {
      db.exec('BEGIN TRANSACTION');
      const result = await callback(prismaClient);
      db.exec('COMMIT');
      return result;
    } catch (error) {
      db.exec('ROLLBACK');
      throw error;
    }
  },
};

export default prismaClient;
