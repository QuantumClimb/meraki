import { NextApiRequest, NextApiResponse } from 'next';
import { getDatabase } from '@/lib/database';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

function authenticateToken(req: NextApiRequest): { userId: number; email: string } {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    throw new Error('Access token required');
  }

  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number; email: string };
  } catch (err) {
    throw new Error('Invalid token');
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  try {
    // Authenticate the request
    authenticateToken(req);
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }

  const db = getDatabase();

  try {
    const [totalProducts, totalOrders, totalUsers, totalCategories] = [
      db.prepare('SELECT COUNT(*) as count FROM Product').get() as { count: number },
      db.prepare('SELECT COUNT(*) as count FROM "Order"').get() as { count: number },
      db.prepare('SELECT COUNT(*) as count FROM User').get() as { count: number },
      db.prepare('SELECT COUNT(*) as count FROM Category').get() as { count: number }
    ];

    const recentOrders = db.prepare(`
      SELECT o.*, u.email as userEmail
      FROM "Order" o
      LEFT JOIN User u ON o.userId = u.id
      ORDER BY o.createdAt DESC
      LIMIT 5
    `).all();

    res.json({
      totalProducts: totalProducts.count,
      totalOrders: totalOrders.count,
      totalUsers: totalUsers.count,
      totalCategories: totalCategories.count,
      recentOrders
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
}
