// Central configuration. Every value comes from environment variables (.env locally,
// the hosting provider's "Environment" settings in production).
import 'dotenv/config';

const port = Number(process.env.PORT || 3000);
// Render sets RENDER=true, so a deployed server always runs in production mode.
const isProd = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';

let dbUrl = process.env.DATABASE_URL;
if (!dbUrl || dbUrl.includes('USER:PASSWORD@HOST') || dbUrl === 'embedded' || dbUrl === 'local') {
  dbUrl = 'embedded';
}

let encKey = process.env.ENCRYPTION_KEY;
if (!encKey || encKey.length < 32) {
  // Safe default encryption key for zero-config local presentations
  encKey = '8379b60ded5fc94b00d455c71c7bd5543142093f6d5798e4548d5d7e6e433582';
}

export const config = {
  port,
  isProd,
  databaseUrl: dbUrl,
  encryptionSecret: encKey,
  // Public base URL. Render sets RENDER_EXTERNAL_URL automatically.
  appUrl: (process.env.APP_URL || process.env.RENDER_EXTERNAL_URL || `http://localhost:${port}`).replace(/\/$/, ''),
  sessionIdleHours: Number(process.env.SESSION_IDLE_HOURS || 12),
  sessionMaxDays: Number(process.env.SESSION_MAX_DAYS || 7),
  workerIntervalMs: Number(process.env.WORKER_INTERVAL_MS || 2000),
  runWorker: process.env.RUN_WORKER !== 'false',
};
