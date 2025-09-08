import type { VercelRequest, VercelResponse } from '@vercel/node';

interface PurchaseData {
  id: string;
  items: Array<{
    product: {
      id: number;
      title: string;
      price: number;
    };
    quantity: number;
  }>;
  total: number;
  timestamp: number;
  whatsappSent: boolean;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const purchaseData: PurchaseData = req.body;
    
    // Here you could save to a database like:
    // - Supabase (free tier)
    // - PlanetScale (free tier)
    // - MongoDB Atlas (free tier)
    // - Airtable (free tier)
    
    // For now, we'll just log the purchase
    console.log('Purchase tracked:', {
      id: purchaseData.id,
      total: purchaseData.total,
      itemCount: purchaseData.items.length,
      timestamp: new Date(purchaseData.timestamp).toISOString(),
    });

    // In a real implementation, you would:
    // 1. Save to your chosen database
    // 2. Send confirmation email
    // 3. Update inventory
    // 4. Generate invoice
    
    return res.status(200).json({ 
      success: true, 
      message: 'Purchase tracked successfully',
      purchaseId: purchaseData.id 
    });
  } catch (error) {
    console.error('Error tracking purchase:', error);
    return res.status(500).json({ 
      error: 'Failed to track purchase',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
