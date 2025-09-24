import Database from 'better-sqlite3';
import path from 'path';

let db: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (!db) {
    // In Vercel, we'll use a file in the project root
    const dbPath = process.env.NODE_ENV === 'production' 
      ? path.join(process.cwd(), 'database', 'products.db')
      : path.join(process.cwd(), 'dev.db');
    
    db = new Database(dbPath);
    
    // Enable foreign keys
    db.pragma('foreign_keys = ON');
    
    // Initialize tables if they don't exist
    initializeTables(db);
  }
  
  return db;
}

function initializeTables(db: Database.Database) {
  // Create tables if they don't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS Category (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      description TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS Product (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      handle TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      image TEXT NOT NULL,
      price INTEGER NOT NULL,
      categoryId INTEGER NOT NULL,
      subcategory TEXT,
      highlights TEXT DEFAULT '[]',
      tags TEXT DEFAULT '[]',
      brand TEXT NOT NULL,
      condition TEXT NOT NULL,
      inventory INTEGER DEFAULT 0,
      seoTitle TEXT,
      seoDescription TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (categoryId) REFERENCES Category(id)
    );

    CREATE TABLE IF NOT EXISTS User (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      name TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS "Order" (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      total INTEGER NOT NULL,
      status TEXT DEFAULT 'PENDING',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES User(id)
    );

    CREATE TABLE IF NOT EXISTS OrderItem (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      orderId INTEGER NOT NULL,
      productId INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      price INTEGER NOT NULL,
      FOREIGN KEY (orderId) REFERENCES "Order"(id),
      FOREIGN KEY (productId) REFERENCES Product(id)
    );

    CREATE TABLE IF NOT EXISTS CartItem (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      productId INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      FOREIGN KEY (userId) REFERENCES User(id),
      FOREIGN KEY (productId) REFERENCES Product(id)
    );

    CREATE TABLE IF NOT EXISTS Admin (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Insert default categories if they don't exist
  const categoryCount = db.prepare('SELECT COUNT(*) as count FROM Category').get() as { count: number };
  if (categoryCount.count === 0) {
    const insertCategory = db.prepare('INSERT INTO Category (name, description) VALUES (?, ?)');
    insertCategory.run('Leather Goods', 'Handcrafted leather accessories and bags');
    insertCategory.run('Electronics', 'Cutting-edge technology and gadgets');
    insertCategory.run('Fragrances', 'Curated scents for men, women, and unisex');
    insertCategory.run('Used/Refurbished', 'Quality restored items at exceptional value');
  }

  // Insert default admin if it doesn't exist
  const adminCount = db.prepare('SELECT COUNT(*) as count FROM Admin').get() as { count: number };
  if (adminCount.count === 0) {
    const bcrypt = require('bcryptjs');
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    const insertAdmin = db.prepare('INSERT INTO Admin (email, password, name) VALUES (?, ?, ?)');
    insertAdmin.run('admin@meraki.com', hashedPassword, 'Admin User');
  }
}

export function closeDatabase() {
  if (db) {
    db.close();
    db = null;
  }
}
