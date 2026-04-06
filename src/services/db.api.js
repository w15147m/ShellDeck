import Database from 'better-sqlite3';
import path from 'node:path';
import fs from 'node:fs';

class DbManager {
  constructor(dbPath) {
    this.dbPath = dbPath;
    this.db = null;
    this.init();
  }

  init() {
    try {
      // Ensure directory exists
      const dbDir = path.dirname(this.dbPath);
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }

      this.db = new Database(this.dbPath);
      console.log('Database connected at:', this.dbPath);

      // Create a generic items table
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT,
          content TEXT,
          status TEXT,
          statusColor TEXT,
          starred INTEGER DEFAULT 0,
          needsInput INTEGER DEFAULT 0,
          needsLocation INTEGER DEFAULT 0,
          needsSudo INTEGER DEFAULT 0,
          date TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Migration: Add columns to existing DB if it already existed
      try { this.db.exec(`ALTER TABLE items ADD COLUMN needsInput INTEGER DEFAULT 0;`); } catch (err) {}
      try { this.db.exec(`ALTER TABLE items ADD COLUMN needsLocation INTEGER DEFAULT 0;`); } catch (err) {}
      try { this.db.exec(`ALTER TABLE items ADD COLUMN needsSudo INTEGER DEFAULT 0;`); } catch (err) {}
    } catch (err) {
      console.error('Failed to initialize database:', err);
    }
  }

  getItems() {
    try {
      const stmt = this.db.prepare('SELECT * FROM items ORDER BY created_at DESC');
      const items = stmt.all();
      return items.map(item => ({
        ...item,
        starred: Boolean(item.starred),
        needsInput: Boolean(item.needsInput),
        needsLocation: Boolean(item.needsLocation),
        needsSudo: Boolean(item.needsSudo)
      }));
    } catch (err) {
      console.error('Error fetching items:', err);
      return [];
    }
  }

  saveItem(item) {
    try {
      console.log('DbManager: Saving item...', item);
      if (item.id) {
        // Update existing item
        const stmt = this.db.prepare(`
          UPDATE items 
          SET title = ?, content = ?, status = ?, statusColor = ?, starred = ?, needsInput = ?, needsLocation = ?, needsSudo = ?, date = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `);
        const info = stmt.run(
          item.title, 
          item.content, 
          item.status, 
          item.statusColor, 
          item.starred ? 1 : 0, 
          item.needsInput ? 1 : 0,
          item.needsLocation ? 1 : 0,
          item.needsSudo ? 1 : 0,
          item.date, 
          item.id
        );
        console.log('DbManager: Update successful, changes:', info.changes);
        return item.id;
      } else {
        // Insert new item
        const stmt = this.db.prepare(`
          INSERT INTO items (title, content, status, statusColor, starred, needsInput, needsLocation, needsSudo, date)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        const result = stmt.run(
          item.title, 
          item.content, 
          item.status, 
          item.statusColor, 
          item.starred ? 1 : 0, 
          item.needsInput ? 1 : 0,
          item.needsLocation ? 1 : 0,
          item.needsSudo ? 1 : 0,
          item.date
        );
        console.log('DbManager: Insert successful, ID:', result.lastInsertRowid);
        return result.lastInsertRowid;
      }
    } catch (err) {
      console.error('DbManager: Save error:', err);
      throw err; // Re-throw to propagate to IPC handler
    }
  }

  deleteItem(id) {
    try {
      const stmt = this.db.prepare('DELETE FROM items WHERE id = ?');
      stmt.run(id);
      return true;
    } catch (err) {
      console.error('Error deleting item:', err);
      return false;
    }
  }

  close() {
    if (this.db) {
      this.db.close();
    }
  }
}

export default DbManager;
