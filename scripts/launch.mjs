#!/usr/bin/env node
// LeadGuard Cross-Platform Application Launcher
// Supports Windows (cmd/PowerShell), macOS, and Linux
// Built with zero-config embedded database fallback for instant presentations
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { spawn, exec } from 'node:child_process';
import pg from 'pg';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const envPath = path.join(rootDir, '.env');
const envExamplePath = path.join(rootDir, '.env.example');

console.log('='.repeat(64));
console.log('  🛡️   LeadGuard CRM — Application Launcher (SE 4525)');
console.log('  Team: Musa, Emaan, Aqsa H.');
console.log('='.repeat(64));

// 1. Check Node.js Version
const nodeMajor = parseInt(process.versions.node.split('.')[0], 10);
if (nodeMajor < 20) {
  console.error(`\n❌ Error: Node.js 20 or newer is required. You are running Node.js ${process.version}.`);
  console.error('Please upgrade Node.js from https://nodejs.org/\n');
  process.exit(1);
}
console.log(`✓ Node.js version ${process.version} detected.`);

// 2. Setup .env file if missing or incomplete
if (!fs.existsSync(envPath)) {
  console.log('ℹ️  .env file not found. Generating a new .env for zero-config local run...');
  const defaultKey = crypto.randomBytes(32).toString('hex');
  const envContent = `# LeadGuard Local Environment
DATABASE_URL=embedded
ENCRYPTION_KEY=${defaultKey}
PORT=3000
WORKER_INTERVAL_MS=2000
`;
  fs.writeFileSync(envPath, envContent, 'utf8');
  console.log('✓ Created .env with zero-config embedded database and secure encryption key.');
}

// 3. Load environment variables
const envText = fs.readFileSync(envPath, 'utf8');
const envVars = {};
for (const line of envText.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const idx = trimmed.indexOf('=');
  if (idx !== -1) {
    const k = trimmed.slice(0, idx).trim();
    const v = trimmed.slice(idx + 1).trim();
    envVars[k] = v;
  }
}

// Ensure ENCRYPTION_KEY exists
if (!envVars.ENCRYPTION_KEY || envVars.ENCRYPTION_KEY.length < 32) {
  const newKey = crypto.randomBytes(32).toString('hex');
  envVars.ENCRYPTION_KEY = newKey;
  let updated = envText.replace(/ENCRYPTION_KEY=.*/, `ENCRYPTION_KEY=${newKey}`);
  if (!updated.includes('ENCRYPTION_KEY=')) {
    updated += `\nENCRYPTION_KEY=${newKey}\n`;
  }
  fs.writeFileSync(envPath, updated, 'utf8');
}

let dbUrl = envVars.DATABASE_URL || 'embedded';
const isPlaceholderUrl = !dbUrl || dbUrl.includes('USER:PASSWORD@HOST') || dbUrl === 'embedded' || dbUrl === 'local';

async function testConnection(url) {
  if (!url || url.includes('USER:PASSWORD@HOST') || url === 'embedded') return false;
  const client = new pg.Client({ connectionString: url, connectionTimeoutMillis: 2500 });
  try {
    await client.connect();
    await client.query('SELECT 1');
    await client.end();
    return true;
  } catch {
    try { await client.end(); } catch {}
    return false;
  }
}

async function prepareDatabase() {
  if (!isPlaceholderUrl) {
    const ok = await testConnection(dbUrl);
    if (ok) {
      console.log(`✓ Connected to external PostgreSQL database at ${dbUrl.replace(/:[^:@]+@/, ':***@')}`);
      process.env.DATABASE_URL = dbUrl;
      return;
    } else {
      console.log(`⚠️  Could not reach external database at ${dbUrl.replace(/:[^:@]+@/, ':***@')}`);
      console.log(`➡️  Switching automatically to embedded local database mode.`);
    }
  }

  // Use embedded mode
  process.env.DATABASE_URL = 'embedded';
  console.log('✓ Using Embedded Local Database (Zero-Config mode: no PostgreSQL or Docker installation required).');
}

function openBrowser(url) {
  const plat = process.platform;
  try {
    if (plat === 'darwin') exec(`open "${url}"`);
    else if (plat === 'win32') exec(`start "" "${url}"`);
    else exec(`xdg-open "${url}"`);
  } catch {
    // ignore
  }
}

async function main() {
  await prepareDatabase();

  // 4. Run database migrations & seed check
  console.log('\n[1/3] Synchronizing database schema...');
  try {
    const { migrate } = await import('../server/src/db/migrate.js');
    await migrate();
    console.log('✓ Database schema up-to-date.');
  } catch (err) {
    console.error('❌ Failed to migrate schema:', err.message);
    process.exit(1);
  }

  console.log('[2/3] Checking demo workspace data...');
  try {
    const { pool } = await import('../server/src/db/pool.js');
    const { rows } = await pool.query('SELECT count(*)::int AS count FROM users');
    if (!rows[0] || rows[0].count === 0) {
      console.log('  → Empty database detected. Loading Sunrise Solar (Demo) workspace...');
      const { spawnSync } = await import('node:child_process');
      spawnSync('node', ['server/src/db/seed.js'], { cwd: rootDir, stdio: 'inherit' });
      console.log('✓ Demo data loaded successfully.');
    } else {
      console.log('✓ Demo workspace already present and ready.');
    }
  } catch (err) {
    console.warn('⚠️  Could not check user count (continuing):', err.message);
  }

  // 5. Start Server
  console.log('\n[3/3] Starting LeadGuard CRM server...');
  const port = envVars.PORT || 3000;
  console.log('='.repeat(64));
  console.log(`  🚀 LeadGuard is running at: http://localhost:${port}`);
  console.log('  ');
  console.log('  Presentation Demo Accounts (Password for all: Demo@12345):');
  console.log('    • Owner:   owner@sunrise.demo   (Full admin & integrations)');
  console.log('    • Sales:   ayesha@sunrise.demo  (CRM, leads & countdowns)');
  console.log('    • Manager: manager@sunrise.demo (Pipeline & recovery queue)');
  console.log('    • Junior:  omar@sunrise.demo    (Restricted / Masked permissions)');
  console.log('='.repeat(64));
  console.log('\nOpening browser at http://localhost:' + port + ' ...');
  console.log('Press Ctrl+C to stop the application.\n');

  setTimeout(() => openBrowser(`http://localhost:${port}`), 1200);

  const appProcess = spawn('node', ['server/src/index.js'], {
    cwd: rootDir,
    stdio: 'inherit',
    env: { ...process.env, PORT: String(port) },
  });

  appProcess.on('close', (code) => {
    process.exit(code || 0);
  });
}

main().catch((err) => {
  console.error('Unhandled Launcher Error:', err);
  process.exit(1);
});
