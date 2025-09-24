# 🚀 Quick Start Template - SQLite + Vercel

A reusable template for creating portable applications with SQLite and Vercel deployment.

## 📋 **Template Checklist**

### **1. Dependencies**
```bash
npm install better-sqlite3 next react react-dom
npm install --save-dev @types/better-sqlite3
```

### **2. File Structure**
```
project/
├── database/
│   └── app.db                 # SQLite database
├── src/
│   ├── lib/
│   │   └── database.ts        # Database utility
│   └── pages/
│       └── api/               # API routes
├── vercel.json                # Vercel config
├── next.config.js             # Next.js config
└── scripts/
    └── migrate.js             # Data migration
```

### **3. Database Utility**
```typescript
// src/lib/database.ts
import Database from 'better-sqlite3';
import path from 'path';

let db: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (!db) {
    const dbPath = process.env.NODE_ENV === 'production' 
      ? path.join(process.cwd(), 'database', 'app.db')
      : path.join(process.cwd(), 'dev.db');
    
    db = new Database(dbPath);
    db.pragma('foreign_keys = ON');
    initializeTables(db);
  }
  return db;
}

function initializeTables(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      value INTEGER NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}
```

### **4. API Route Template**
```typescript
// src/pages/api/items/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getDatabase } from '@/lib/database';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = getDatabase();

  if (req.method === 'GET') {
    try {
      const items = db.prepare('SELECT * FROM items ORDER BY createdAt DESC').all();
      res.json({ items });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch items' });
    }
  } else if (req.method === 'POST') {
    try {
      const { name, value } = req.body;
      const insertItem = db.prepare('INSERT INTO items (name, value) VALUES (?, ?)');
      const result = insertItem.run(name, value);
      
      const item = db.prepare('SELECT * FROM items WHERE id = ?').get(result.lastInsertRowid);
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create item' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
```

### **5. Vercel Configuration**
```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "JWT_SECRET": "@jwt-secret"
  }
}
```

### **6. Next.js Configuration**
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.externals.push({
      'better-sqlite3': 'commonjs better-sqlite3',
    });
    return config;
  },
}

module.exports = nextConfig
```

### **7. Package.json Scripts**
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "migrate": "node scripts/migrate.js"
  }
}
```

### **8. Migration Script**
```javascript
// scripts/migrate.js
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

async function migrate() {
  const dbDir = path.join(process.cwd(), 'database');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const db = new Database(path.join(dbDir, 'app.db'));
  db.pragma('foreign_keys = ON');

  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      value INTEGER NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Insert sample data
  const insertItem = db.prepare('INSERT INTO items (name, value) VALUES (?, ?)');
  insertItem.run('Sample Item', 1000);

  console.log('✅ Migration completed!');
}

migrate();
```

## 🚀 **Deployment Steps**

### **1. Deploy to Vercel**
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### **2. Set Environment Variables**
```bash
vercel env add JWT_SECRET
# Enter: your-secret-key-here
```

### **3. Test Deployment**
```bash
curl https://your-app.vercel.app/api/items
```

## 🔧 **Customization**

### **Add New Table**
```typescript
// In src/lib/database.ts
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);
```

### **Add New API Route**
```typescript
// src/pages/api/users/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getDatabase } from '@/lib/database';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = getDatabase();
  // ... implement CRUD operations
}
```

### **Add Authentication**
```typescript
// Add JWT authentication to protected routes
import jwt from 'jsonwebtoken';

function authenticateToken(req: NextApiRequest): any {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    throw new Error('Access token required');
  }
  
  return jwt.verify(token, process.env.JWT_SECRET!);
}
```

## 📊 **Performance Tips**

1. **Use prepared statements** for repeated queries
2. **Add indexes** for frequently queried columns
3. **Limit result sets** with pagination
4. **Use transactions** for multiple operations
5. **Cache frequently accessed data**

## 🔒 **Security Checklist**

- [ ] Use parameterized queries (prevent SQL injection)
- [ ] Validate all input data
- [ ] Implement proper authentication
- [ ] Use environment variables for secrets
- [ ] Add rate limiting for API routes
- [ ] Implement proper error handling

## 🎯 **Use Cases**

- **E-commerce stores** (1-1000 products)
- **Content management systems**
- **Blog platforms**
- **Portfolio websites**
- **MVP applications**
- **Local business sites**

## 📚 **Documentation**

- [Full Integration Guide](./SQLITE_VERCEL_INTEGRATION.md)
- [Vercel Documentation](https://vercel.com/docs)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

---

**This template provides a solid foundation for building portable, cost-effective applications with zero database management overhead.**
