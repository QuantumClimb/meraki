import { NextApiRequest, NextApiResponse } from 'next';
import { getDatabase } from '@/lib/database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  const db = getDatabase();

  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    const admin = db.prepare('SELECT * FROM Admin WHERE email = ?').get(email) as { id: number; email: string; password: string; name: string } | undefined;

    if (!admin || !bcrypt.compareSync(password, admin.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ 
      token, 
      admin: { 
        id: admin.id, 
        email: admin.email, 
        name: admin.name 
      } 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}
