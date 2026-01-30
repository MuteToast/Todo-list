const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, 'todos.db');
const db = new Database(dbPath);

db.prepare(`
    CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        done INTEGER DEFAULT 0
    )
`).run();

module.exports = db;
