import { PrismaClient } from '@prisma/client';
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function migrateToVercel() {
  try {
    console.log('🔄 Migrating data to Vercel SQLite format...');

    // Create database directory
    const dbDir = path.join(process.cwd(), 'database');
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    // Create new SQLite database
    const db = new Database(path.join(dbDir, 'products.db'));
    
    // Enable foreign keys
    db.pragma('foreign_keys = ON');

    // Create tables
    console.log('📋 Creating tables...');
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

    // Migrate categories
    console.log('🏷️ Migrating categories...');
    const categories = await prisma.category.findMany();
    const insertCategory = db.prepare('INSERT INTO Category (name, description) VALUES (?, ?)');
    const categoryMap = new Map();
    
    for (const category of categories) {
      const result = insertCategory.run(category.name, category.description);
      categoryMap.set(category.id, result.lastInsertRowid);
      console.log(`  ✓ ${category.name}`);
    }

    // Migrate products
    console.log('📦 Migrating products...');
    const products = await prisma.product.findMany();
    const insertProduct = db.prepare(`
      INSERT INTO Product (handle, title, description, image, price, categoryId, subcategory, highlights, tags, brand, condition, inventory, seoTitle, seoDescription)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    for (const product of products) {
      const newCategoryId = categoryMap.get(product.categoryId);
      if (newCategoryId) {
        insertProduct.run(
          product.handle,
          product.title,
          product.description,
          product.image,
          product.price,
          newCategoryId,
          product.subcategory,
          product.highlights,
          product.tags,
          product.brand,
          product.condition,
          product.inventory,
          product.seoTitle,
          product.seoDescription
        );
        console.log(`  ✓ ${product.title}`);
      }
    }

    // Create admin user
    console.log('👤 Creating admin user...');
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    const insertAdmin = db.prepare('INSERT INTO Admin (email, password, name) VALUES (?, ?, ?)');
    insertAdmin.run('admin@meraki.com', hashedPassword, 'Admin User');
    console.log('  ✓ Admin user created');

    console.log('\n✅ Migration completed successfully!');
    console.log(`📊 Migrated ${categories.length} categories and ${products.length} products`);
    console.log('🗄️ Database saved to: database/products.db');
    console.log('🔑 Admin credentials: admin@meraki.com / admin123');

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateToVercel();
