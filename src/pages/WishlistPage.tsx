
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import { Button } from "@/components/ui/button";
import { Trash2 } from 'lucide-react';

const WishlistPage = () => {
  const { products } = useProducts();
  
  // This is mock data - eventually this would be connected to Shopify
  // Convert product IDs to strings to match the Product type
  const [wishlistItems, setWishlistItems] = useState([
    { productId: '1' },
    { productId: '3' },
    { productId: '5' }
  ]);

  const wishlistProducts = products.filter(product => 
    wishlistItems.some(item => item.productId === String(product.id))
  );

  const removeFromWishlist = (productId: string) => {
    setWishlistItems(wishlistItems.filter(item => item.productId !== productId));
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container-custom pt-28 pb-20">
        <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-4">My Wishlist</h1>
        
        {wishlistItems.length > 0 ? (
          <>
            <div className="flex justify-end mb-6">
              <Button 
                variant="outline" 
                onClick={clearWishlist}
                className="flex items-center gap-2"
              >
                <Trash2 size={16} />
                Clear Wishlist
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {wishlistProducts.map((product) => (
                <div key={product.id} className="relative">
                  <button 
                    className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
                    onClick={() => removeFromWishlist(String(product.id))}
                  >
                    <Trash2 size={18} className="text-gray-700" />
                  </button>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium mb-4">Your wishlist is empty</h3>
            <p className="text-gray-600 mb-6">Add items to your wishlist to save them for later</p>
            <Button asChild>
              <a href="/products">Browse Products</a>
            </Button>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default WishlistPage;
