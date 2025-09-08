
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { type Product } from '../hooks/useProducts';
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const handleAddToCart = () => {
    console.log('Added to cart:', product.title);
  };

  const handleAddToWishlist = () => {
    console.log('Added to wishlist:', product.title);
  };

  return (
    <div className="group product-card">
      <Link 
        to={`/product/${product.handle}`}
        className="block"
      >
        <div className="overflow-hidden rounded-lg mb-4">
          <img 
            src={product.image} 
            alt={product.title} 
            className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </Link>
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2 mb-2">
          <span className="badge bg-primary text-white">{product.category}</span>
          {product.tags.slice(0, 2).map((tag, index) => (
            <span key={index} className="badge">{tag}</span>
          ))}
        </div>
        <Link to={`/product/${product.handle}`}>
          <h3 className="font-playfair text-xl">{product.title}</h3>
        </Link>
        <ul className="text-sm text-gray-600 space-y-1">
          {product.highlights.map((highlight, index) => (
            <li key={index} className="flex items-center">
              <span className="mr-2 text-primary">•</span>
              {highlight}
            </li>
          ))}
        </ul>
        <div className="pt-3 flex justify-between items-center">
          <span className="font-mono text-lg font-semibold">₹{product.price?.toLocaleString('en-IN') || "1,249"}</span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleAddToWishlist}
              className="hover:text-red-500"
            >
              <Heart className="h-4 w-4" />
            </Button>
            <Button
              variant="default"
              size="icon"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
