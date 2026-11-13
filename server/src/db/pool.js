// Shared database connection layer supporting both embedded local storage (PGlite)
// and external PostgreSQL connection pooling (Neon / Render / Docker).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';
import { PGlite, types as pgTypes } from '@electric-sql/pglite';
import { config } from '../config.js';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const dataDir = path.join(rootDir, 'data', 'leadguard-db');

export const isEmbedded = !config.databaseUrl ||
  config.databaseUrl === 'embedded' ||
  config.databaseUrl.startsWith('embedded:') ||
  config.databaseUrl.startsWith('pglite:') ||
  config.databaseUrl.includes('USER:PASSWORD@HOST');

let poolInstance;
let pgliteInstance = null;

async function pgliteQuery(client, text, params) {
  if (params && params.length > 0) {
    return await client.query(text, params);
  }
  try {
    return await client.query(text);
  } catch (err) {
    if (err.message && err.message.includes('cannot insert multiple commands')) {
      const results = await client.exec(text);
      return Array.isArray(results) ? (results[results.length - 1] || { rows: [], rowCount: 0 }) : results;
    }
    throw err;
  }
}

if (isEmbedded) {
  fs.mkdirSync(dataDir, { recursive: true });
  pgliteInstance = new PGlite(dataDir, {
    parsers: {
      [pgTypes.NUMERIC]: (v) => (v === null ? null : Number(v)),
      [pgTypes.INT8]: (v) => (v === null ? null : Number(v)),
    },
  });

  poolInstance = {
    isEmbedded: true,
    query: (text, params) => pgliteQuery(pgliteInstance, text, params),
    connect: async () => ({
      query: (text, params) => pgliteQuery(pgliteInstance, text, params),
      release: () => {},
      afterCommit: [],
    }),
    end: async () => {
      try { await pgliteInstance.close(); } catch {}
    },
    on: () => {},
  };
} else {
  // Return numeric/bigint columns as JS numbers (amounts here are far below 2^53).
  pg.types.setTypeParser(1700, (v) => (v === null ? null : Number(v))); // numeric
  pg.types.setTypeParser(20, (v) => (v === null ? null : Number(v)));   // bigint / count(*)
  pg.types.setTypeParser(1082, (v) => v);                               // date

  poolInstance = new pg.Pool({
    connectionString: config.databaseUrl,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 15_000,
  });

  poolInstance.on('error', (err) => {
    console.error('[db] idle client error:', err.message);
  });
}

export const pool = poolInstance;

export function query(text, params) {
  return pool.query(text, params);
}

export async function one(text, params) {
  const { rows } = await pool.query(text, params);
  return rows[0] || null;
}

// Run fn(client) inside a transaction. Rolls back on any error.
export async function tx(fn) {
  if (isEmbedded && pgliteInstance) {
    return await pgliteInstance.transaction(async (txClient) => {
      txClient.afterCommit = [];
      const clientWrapper = {
        query: (text, params) => pgliteQuery(txClient, text, params),
        afterCommit: txClient.afterCommit,
        release: () => {},
      };
      const result = await fn(clientWrapper);
      for (const cb of txClient.afterCommit) {
        try { cb(); } catch (e) { console.error('[afterCommit]', e); }
      }
      return result;
    });
  }

  const client = await pool.connect();
  client.afterCommit = [];
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    for (const cb of client.afterCommit) {
      try { cb(); } catch (e) { console.error('[afterCommit]', e); }
    }
    return result;
  } catch (err) {
    try { await client.query('ROLLBACK'); } catch { /* ignore */ }
    throw err;
  } finally {
    client.afterCommit = null;
    client.release();
  }
}

// Run cb once the surrounding transaction commits (or right away when not in a transaction).
export function onCommit(db, cb) {
  if (db && Array.isArray(db.afterCommit)) db.afterCommit.push(cb);
  else setImmediate(cb);
}
