# 🗄️ SQLite + Vercel Integration Guide

This document provides a comprehensive guide for implementing portable SQLite databases with Vercel serverless functions, making it a reusable pattern for future projects.

## 🎯 **Why SQLite + Vercel?**

### **Benefits**
- **Zero Database Management** - No external database hosting required
- **Portable** - Entire application in one Git repository
- **Cost-Effective** - Free tier covers small to medium applications
- **Fast** - SQLite performance is excellent for small datasets
- **Simple** - No connection strings, credentials, or scaling concerns
- **Reliable** - No external dependencies to fail

### **Perfect Use Cases**
- Small to medium e-commerce stores (1-1000 products)
- Portfolio projects and demos
- MVP development and prototyping
- Local business websites
- Content management systems
- Blog platforms
- Any application with <1000 records per table

## 🏗️ **Architecture Overview**

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Vercel API     │    │   SQLite DB     │
│   (Next.js)     │◄──►│   Routes         │◄──►│   (File-based)  │
│                 │    │   (Serverless)   │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🔧 **Implementation Steps**

### **1. Database Setup**

#### **Install Dependencies**
```bash
npm install better-sqlite3
npm install --save-dev @types/better-sqlite3
```

#### **Create Database Utility**
```typescript
// src/lib/database.ts
import Database from 'better-sqlite3';
import path from 'path';

let db: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (!db) {
    const dbPath = process.env.NODE_ENV === 'production' 
      ? path.join(process.cwd(), 'database', 'products.db')
      : path.join(process.cwd(), 'dev.db');
    
    db = new Database(dbPath);
    db.pragma('foreign_keys = ON');
    initializeTables(db);
  }
  return db;
}

function initializeTables(db: Database.Database) {
  // Create tables if they don't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      name TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      price INTEGER NOT NULL,
      description TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

export function closeDatabase() {
  if (db) {
    db.close();
    db = null;
  }
}
```

### **2. API Routes Implementation**

#### **Products API Route**
```typescript
// src/pages/api/products/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getDatabase } from '@/lib/database';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = getDatabase();

  if (req.method === 'GET') {
    try {
      const products = db.prepare('SELECT * FROM products ORDER BY createdAt DESC').all();
      res.json({ products });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  } else if (req.method === 'POST') {
    try {
      const { title, price, description } = req.body;
      const insertProduct = db.prepare(`
        INSERT INTO products (title, price, description) 
        VALUES (?, ?, ?)
      `);
      const result = insertProduct.run(title, price, description);
      
      const product = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create product' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
```

#### **Individual Product API Route**
```typescript
// src/pages/api/products/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getDatabase } from '@/lib/database';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = getDatabase();
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const product = db.prepare('SELECT * FROM products WHERE id = ?').get(Number(id));
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch product' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { title, price, description } = req.body;
      const updateProduct = db.prepare(`
        UPDATE products 
        SET title = ?, price = ?, description = ?
        WHERE id = ?
      `);
      updateProduct.run(title, price, description, Number(id));
      
      const product = db.prepare('SELECT * FROM products WHERE id = ?').get(Number(id));
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update product' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const deleteProduct = db.prepare('DELETE FROM products WHERE id = ?');
      const result = deleteProduct.run(Number(id));
      
      if (result.changes === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete product' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
```

### **3. Vercel Configuration**

#### **vercel.json**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    }
  ],
  "env": {
    "JWT_SECRET": "@jwt-secret"
  }
}
```

#### **next.config.js**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    esmExternals: false,
  },
  webpack: (config) => {
    config.externals.push({
      'better-sqlite3': 'commonjs better-sqlite3',
    });
    return config;
  },
}

module.exports = nextConfig
```

### **4. Data Migration Script**

```javascript
// scripts/migrate-data.js
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

async function migrateData() {
  try {
    // Create database directory
    const dbDir = path.join(process.cwd(), 'database');
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    // Create new SQLite database
    const db = new Database(path.join(dbDir, 'products.db'));
    db.pragma('foreign_keys = ON');

    // Create tables
    db.exec(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        price INTEGER NOT NULL,
        description TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Insert sample data
    const insertProduct = db.prepare(`
      INSERT INTO products (title, price, description) 
      VALUES (?, ?, ?)
    `);
    
    const sampleProducts = [
      ['Sample Product 1', 2999, 'A great product'],
      ['Sample Product 2', 4999, 'Another great product'],
    ];

    for (const product of sampleProducts) {
      insertProduct.run(...product);
    }

    console.log('✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

migrateData();
```

## 🚀 **Deployment Process**

### **1. Prepare for Deployment**
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Run migration
npm run migrate:vercel
```

### **2. Deploy to Vercel**
```bash
# Deploy
vercel --prod

# Set environment variables
vercel env add JWT_SECRET
# Enter a strong secret key
```

### **3. Verify Deployment**
```bash
# Test API endpoints
curl https://your-app.vercel.app/api/products
curl https://your-app.vercel.app/api/products/1
```

## 📊 **Performance Considerations**

### **SQLite Performance**
- **Read Operations**: ~1ms for 1000 records
- **Write Operations**: ~5ms for inserts/updates
- **Concurrent Reads**: 100+ simultaneous
- **Database Size**: ~1MB per 1000 records

### **Vercel Limits**
- **Function Execution**: 10 seconds max
- **Memory**: 1024MB per function
- **Concurrent Executions**: 1000 (Pro plan)
- **Cold Start**: ~200ms for SQLite

### **Optimization Tips**
1. **Use prepared statements** for repeated queries
2. **Index frequently queried columns**
3. **Limit result sets** with pagination
4. **Cache frequently accessed data**
5. **Use transactions** for multiple operations

## 🔒 **Security Best Practices**

### **Database Security**
```typescript
// Use parameterized queries (prevents SQL injection)
const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);

// Validate input data
if (!title || typeof title !== 'string') {
  return res.status(400).json({ error: 'Invalid title' });
}

// Use transactions for critical operations
const transaction = db.transaction((products) => {
  for (const product of products) {
    insertProduct.run(product.title, product.price);
  }
});
```

### **API Security**
```typescript
// Add authentication middleware
function authenticateToken(req: NextApiRequest): any {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    throw new Error('Access token required');
  }
  
  return jwt.verify(token, process.env.JWT_SECRET!);
}

// Use in protected routes
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    authenticateToken(req);
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
  // ... rest of handler
}
```

## 🛠️ **Development Workflow**

### **Local Development**
```bash
# Start development server
npm run dev:next

# Test API routes
curl http://localhost:3000/api/products

# View database
npx prisma studio
```

### **Database Management**
```bash
# Backup database
cp database/products.db backup/products-$(date +%Y%m%d).db

# Restore database
cp backup/products-20241201.db database/products.db

# Reset database
rm database/products.db
npm run migrate:vercel
```

### **Testing**
```bash
# Test API endpoints
npm run test:api

# Test database operations
npm run test:db

# Integration tests
npm run test:integration
```

## 📈 **Scaling Considerations**

### **When to Upgrade**
- **Database Size**: >100MB
- **Concurrent Users**: >1000
- **Query Performance**: >100ms average
- **Storage Requirements**: >1GB

### **Migration Path**
1. **PostgreSQL**: For larger datasets
2. **MySQL**: For complex queries
3. **MongoDB**: For document-based data
4. **Redis**: For caching layer

### **Hybrid Approach**
```typescript
// Use SQLite for local development
// Use PostgreSQL for production
const db = process.env.NODE_ENV === 'production' 
  ? new PostgreSQL(process.env.DATABASE_URL)
  : new Database('dev.db');
```

## 🔧 **Troubleshooting**

### **Common Issues**

#### **Database Locked**
```bash
# Check for running processes
lsof database/products.db

# Kill processes if needed
kill -9 <PID>
```

#### **Vercel Build Errors**
```bash
# Check build logs
vercel logs

# Test locally
npm run build
npm run start
```

#### **API Route Errors**
```bash
# Check function logs
vercel logs --follow

# Test endpoints
curl -X POST https://your-app.vercel.app/api/products \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","price":1000}'
```

### **Debugging Tips**
1. **Add logging** to API routes
2. **Test locally** before deploying
3. **Check Vercel function logs**
4. **Validate database file** exists
5. **Test environment variables**

## 📚 **Additional Resources**

- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [Better-SQLite3 Documentation](https://github.com/WiseLibs/better-sqlite3)
- [Vercel API Routes](https://vercel.com/docs/concepts/functions/serverless-functions)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

## 🎯 **Template Usage**

This integration pattern can be reused for:
- **E-commerce stores**
- **Content management systems**
- **Blog platforms**
- **Portfolio websites**
- **MVP applications**
- **Local business sites**

Simply copy the database utility, API route structure, and Vercel configuration to any new project!

---

**This integration provides a solid foundation for building portable, cost-effective applications with zero database management overhead.**
