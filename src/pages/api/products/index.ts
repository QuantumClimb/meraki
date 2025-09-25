import { NextApiRequest, NextApiResponse } from 'next';
import { getDatabase } from '@/lib/database';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = getDatabase();

  if (req.method === 'GET') {
    try {
      const { page = 1, limit = 100, category, search } = req.query;
      const skip = (Number(page) - 1) * Number(limit);
      
      let whereClause = '';
      const params: (string | number)[] = [];
      
      if (category) {
        whereClause += ' WHERE p.categoryId = ?';
        params.push(Number(category));
      }
      
      if (search) {
        const searchClause = whereClause ? ' AND' : ' WHERE';
        whereClause += `${searchClause} (p.title LIKE ? OR p.description LIKE ? OR p.brand LIKE ?)`;
        const searchTerm = `%${search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
      }

      // Get products with category info
      const productsQuery = `
        SELECT p.*, c.name as categoryName 
        FROM Product p 
        LEFT JOIN Category c ON p.categoryId = c.id 
        ${whereClause}
        ORDER BY p.createdAt DESC 
        LIMIT ? OFFSET ?
      `;
      
      const products = db.prepare(productsQuery).all(...params, Number(limit), skip);
      
      // Get total count
      const countQuery = `SELECT COUNT(*) as total FROM Product p ${whereClause}`;
      const total = db.prepare(countQuery).get(...params) as { total: number };

      // Parse JSON fields
      const processedProducts = products.map((product: { id: number; title: string; description: string; image: string; price: number; categoryId: number; subcategory?: string; highlights: string; tags: string; brand: string; condition: string; inventory: number; seoTitle?: string; seoDescription?: string; createdAt: string; updatedAt: string; categoryName?: string }) => ({
        ...product,
        highlights: JSON.parse(product.highlights || '[]'),
        tags: JSON.parse(product.tags || '[]'),
        category: { name: product.categoryName }
      }));

      res.json({
        products: processedProducts,
        total: total.total,
        pages: Math.ceil(total.total / Number(limit))
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  } else if (req.method === 'POST') {
    // Create new product
    try {
      const { title, description, image, price, categoryId, subcategory, highlights, tags, brand, condition, inventory, seoTitle, seoDescription } = req.body as {
        title: string;
        description: string;
        image: string;
        price: number;
        categoryId: number;
        subcategory?: string;
        highlights?: string;
        tags?: string;
        brand: string;
        condition: string;
        inventory: number;
        seoTitle?: string;
        seoDescription?: string;
      };
      
      const insertProduct = db.prepare(`
        INSERT INTO Product (handle, title, description, image, price, categoryId, subcategory, highlights, tags, brand, condition, inventory, seoTitle, seoDescription)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      const handle = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const result = insertProduct.run(
        handle,
        title,
        description,
        image,
        price,
        categoryId,
        subcategory || null,
        JSON.stringify(highlights || []),
        JSON.stringify(tags || []),
        brand,
        condition,
        inventory,
        seoTitle || null,
        seoDescription || null
      );

      // Get the created product with category
      const product = db.prepare(`
        SELECT p.*, c.name as categoryName 
        FROM Product p 
        LEFT JOIN Category c ON p.categoryId = c.id 
        WHERE p.id = ?
      `).get(result.lastInsertRowid) as any;

      res.json({
        id: product.id,
        handle: product.handle,
        title: product.title,
        description: product.description,
        image: product.image,
        price: product.price,
        subcategory: product.subcategory,
        brand: product.brand,
        condition: product.condition,
        inventory: product.inventory,
        seoTitle: product.seoTitle,
        seoDescription: product.seoDescription,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        highlights: JSON.parse(product.highlights || '[]'),
        tags: JSON.parse(product.tags || '[]'),
        category: { name: product.categoryName }
      });
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ error: 'Failed to create product' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
