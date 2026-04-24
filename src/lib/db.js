// DB wrapper using sql.js in-browser
// Lazy-load sql.js wasm, persist DB as base64 in localStorage under key 'pg_db'
let SQL;
let db;
const STORAGE_KEY = 'pg_db';

async function init() {
  if (db) return db;
  if (!SQL) {
    try {
      const initSqlJs = (await import('sql.js')).default;
      SQL = await initSqlJs({
        locateFile: (file) => `https://sql.js.org/dist/${file}`
      });
    } catch (e) {
      console.error('Failed to load sql.js:', e);
      throw e;
    }
  }

  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const bytes = Uint8Array.from(atob(saved), c => c.charCodeAt(0));
      db = new SQL.Database(bytes);
    } catch (e) {
      console.warn('Failed to load saved DB, creating new:', e);
      db = new SQL.Database();
      _migrate();
      _persist();
    }
  } else {
    db = new SQL.Database();
    _migrate();
    _persist();
  }

  return db;
}

function _migrate() {
  const schema = `
    CREATE TABLE IF NOT EXISTS players (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      avatar TEXT,
      created_at INTEGER
    );
    CREATE TABLE IF NOT EXISTS scores (
      id TEXT PRIMARY KEY,
      player_id TEXT,
      correct INTEGER,
      total_time_ms INTEGER,
      score INTEGER,
      date INTEGER
    );
  `;
  db.run(schema);
}

function _persist() {
  try {
    const data = db.export();
    const str = btoa(String.fromCharCode.apply(null, data));
    localStorage.setItem(STORAGE_KEY, str);
  } catch (e) {
    console.error('Failed to persist DB:', e);
  }
}

async function addPlayer({id, name, avatar}) {
  await init();
  const now = Date.now();
  db.run(`INSERT OR REPLACE INTO players (id,name,avatar,created_at) VALUES (?,?,?,?)`, [id, name, avatar, now]);
  _persist();
}

async function getPlayers() {
  await init();
  const res = db.exec(`SELECT id,name,avatar,created_at FROM players ORDER BY created_at DESC`);
  if (!res[0]) return [];
  return res[0].values.map(r => ({id:r[0],name:r[1],avatar:r[2],created_at:r[3]}));
}

async function addScore({id, player_id, correct, total_time_ms, score}) {
  await init();
  const now = Date.now();
  db.run(`INSERT INTO scores (id,player_id,correct,total_time_ms,score,date) VALUES (?,?,?,?,?,?)`, [id,player_id,correct,total_time_ms,score,now]);
  _persist();
}

async function getTopScores(limit=20) {
  await init();
  const res = db.exec(`
    SELECT s.id,s.player_id,p.name,p.avatar,s.correct,s.total_time_ms,s.score,s.date
    FROM scores s
    LEFT JOIN players p ON p.id = s.player_id
    ORDER BY s.correct DESC, s.total_time_ms ASC
    LIMIT ${limit}
  `);
  if (!res[0]) return [];
  return res[0].values.map(r=>({id:r[0],player_id:r[1],name:r[2],avatar:r[3],correct:r[4],total_time_ms:r[5],score:r[6],date:r[7]}));
}

export default { init, addPlayer, getPlayers, addScore, getTopScores };
