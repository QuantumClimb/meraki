import { NextApiRequest, NextApiResponse } from 'next';
import { getDatabase } from '@/lib/database';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = getDatabase();
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const product = db.prepare(`
        SELECT p.*, c.name as categoryName 
        FROM Product p 
        LEFT JOIN Category c ON p.categoryId = c.id 
        WHERE p.id = ?
      `).get(Number(id));

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.json({
        ...product,
        highlights: JSON.parse(product.highlights || '[]'),
        tags: JSON.parse(product.tags || '[]'),
        category: { name: product.categoryName }
      });
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ error: 'Failed to fetch product' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { title, description, image, price, categoryId, subcategory, highlights, tags, brand, condition, inventory, seoTitle, seoDescription } = req.body;
      
      const updateProduct = db.prepare(`
        UPDATE Product 
        SET title = ?, description = ?, image = ?, price = ?, categoryId = ?, subcategory = ?, 
            highlights = ?, tags = ?, brand = ?, condition = ?, inventory = ?, 
            seoTitle = ?, seoDescription = ?, updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?
      `);
      
      updateProduct.run(
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
        seoDescription || null,
        Number(id)
      );

      // Get the updated product with category
      const product = db.prepare(`
        SELECT p.*, c.name as categoryName 
        FROM Product p 
        LEFT JOIN Category c ON p.categoryId = c.id 
        WHERE p.id = ?
      `).get(Number(id));

      res.json({
        ...product,
        highlights: JSON.parse(product.highlights || '[]'),
        tags: JSON.parse(product.tags || '[]'),
        category: { name: product.categoryName }
      });
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ error: 'Failed to update product' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const deleteProduct = db.prepare('DELETE FROM Product WHERE id = ?');
      const result = deleteProduct.run(Number(id));

      if (result.changes === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ error: 'Failed to delete product' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
