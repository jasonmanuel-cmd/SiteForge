// Prisma Client Stub - Works around Prisma engine download issues
// This uses better-sqlite3 directly instead of Prisma's engines

import Database from 'better-sqlite3';
import path from 'path';
import { randomUUID } from 'crypto';

const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
const db = new Database(dbPath);

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
      stmt.run(...values);

      return this.findUnique({ where });
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
