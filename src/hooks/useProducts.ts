import { useState, useEffect } from 'react';
import productsData from '../data/products.json';

export type Product = {
  id: number;
  handle: string;
  title: string;
  description: string;
  image: string;
  price: number;
  category: string;
  subcategory: string;
  highlights: string[];
  tags: string[];
  brand: string;
  condition: string;
  inventory: number;
  seo_title: string;
  seo_description: string;
};

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Simulate API fetch with setTimeout
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        // Simulate network request
        await new Promise(resolve => setTimeout(resolve, 300));
        
        setProducts(productsData as Product[]);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load products'));
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const getProductByHandle = (handle: string) => {
    return products.find(product => product.handle === handle) || null;
  };

  return {
    products,
    isLoading,
    error,
    getProductByHandle
  };
}
