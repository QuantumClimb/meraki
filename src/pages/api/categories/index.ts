import { NextApiRequest, NextApiResponse } from 'next';
import { getDatabase } from '@/lib/database';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = getDatabase();

  if (req.method === 'GET') {
    try {
      const categories = db.prepare(`
        SELECT c.*, COUNT(p.id) as productCount
        FROM Category c
        LEFT JOIN Product p ON c.id = p.categoryId
        GROUP BY c.id
        ORDER BY c.name
      `).all();

      res.json(categories.map(cat => ({
        ...cat,
        _count: { products: cat.productCount }
      })));
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  } else if (req.method === 'POST') {
    try {
      const { name, description } = req.body;
      
      const insertCategory = db.prepare('INSERT INTO Category (name, description) VALUES (?, ?)');
      const result = insertCategory.run(name, description);

      const category = db.prepare('SELECT * FROM Category WHERE id = ?').get(result.lastInsertRowid);
      res.json(category);
    } catch (error) {
      console.error('Error creating category:', error);
      res.status(500).json({ error: 'Failed to create category' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
