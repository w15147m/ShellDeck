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
          date TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
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
        starred: Boolean(item.starred)
      }));
    } catch (err) {
      console.error('Error fetching items:', err);
      return [];
    }
  }

  saveItem(item) {
    try {
      if (item.id) {
        // Update existing item
        const stmt = this.db.prepare(`
          UPDATE items 
          SET title = ?, content = ?, status = ?, statusColor = ?, starred = ?, date = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `);
        stmt.run(
          item.title, 
          item.content, 
          item.status, 
          item.statusColor, 
          item.starred ? 1 : 0, 
          item.date, 
          item.id
        );
        return item.id;
      } else {
        // Insert new item
        const stmt = this.db.prepare(`
          INSERT INTO items (title, content, status, statusColor, starred, date)
          VALUES (?, ?, ?, ?, ?, ?)
        `);
        const result = stmt.run(
          item.title, 
          item.content, 
          item.status, 
          item.statusColor, 
          item.starred ? 1 : 0, 
          item.date
        );
        return result.lastInsertRowid;
      }
    } catch (err) {
      console.error('Error saving item:', err);
      return null;
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
