
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useProducts } from '../hooks/useProducts';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

const CartPage = () => {
  const { products } = useProducts();
  
  // This is mock data - eventually this would be connected to Shopify
  const [cartItems, setCartItems] = useState([
    { productId: '2', quantity: 1 },
    { productId: '4', quantity: 2 }
  ]);

  const cartProducts = products
    .filter(product => cartItems.some(item => item.productId === String(product.id)))
    .map(product => {
      const cartItem = cartItems.find(item => item.productId === String(product.id));
      return {
        ...product,
        quantity: cartItem?.quantity || 0
      };
    });

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCartItems(cartItems.map(item => 
      item.productId === productId 
        ? { ...item, quantity: newQuantity } 
        : item
    ));
  };

  const removeFromCart = (productId: string) => {
    setCartItems(cartItems.filter(item => item.productId !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate subtotal
  const subtotal = cartProducts.reduce((total, product) => {
    return total + (product.quantity * (product.price || 1249));
  }, 0);
  
  // Calculate estimated tax (for example, 18% GST)
  const estimatedTax = subtotal * 0.18;
  
  // Calculate total
  const total = subtotal + estimatedTax;

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container-custom pt-28 pb-20">
        <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-4">Shopping Cart</h1>
        
        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {cartProducts.map((product) => (
                  <div key={product.id} className="flex flex-col sm:flex-row items-start sm:items-center p-4 border-b border-gray-200 last:border-b-0">
                    <div className="sm:w-20 sm:h-20 mb-4 sm:mb-0 sm:mr-4">
                      <img 
                        src={product.image} 
                        alt={product.title} 
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                    
                    <div className="flex-grow">
                      <Link to={`/product/${product.handle}`} className="font-medium hover:text-primary">
                        {product.title}
                      </Link>
                      <div className="text-sm text-gray-500 mt-1">
                        ₹{(product.price || 1249).toLocaleString('en-IN')} each
                      </div>
                    </div>
                    
                    <div className="flex items-center mt-4 sm:mt-0">
                      <button 
                        onClick={() => updateQuantity(String(product.id), product.quantity - 1)}
                        className="p-1 border border-gray-300 rounded-l"
                      >
                        <Minus size={16} />
                      </button>
                      <div className="px-3 py-1 border-y border-gray-300">
                        {product.quantity}
                      </div>
                      <button 
                        onClick={() => updateQuantity(String(product.id), product.quantity + 1)}
                        className="p-1 border border-gray-300 rounded-r"
                      >
                        <Plus size={16} />
                      </button>
                      
                      <div className="ml-4 font-medium">
                        ₹{((product.price || 1249) * product.quantity).toLocaleString('en-IN')}
                      </div>
                      
                      <button 
                        onClick={() => removeFromCart(String(product.id))}
                        className="ml-4 p-1 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex justify-between items-center">
                <Button 
                  variant="outline" 
                  onClick={clearCart}
                  className="flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Clear Cart
                </Button>
                
                <Button asChild>
                  <Link to="/products">Continue Shopping</Link>
                </Button>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-medium mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estimated Tax</span>
                    <span>₹{estimatedTax.toLocaleString('en-IN')}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <span>₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="flex gap-2 mb-2">
                    <Input placeholder="Promo code" className="flex-grow" />
                    <Button variant="outline">Apply</Button>
                  </div>
                </div>
                
                <Button className="w-full mb-4" asChild>
                  <Link to="/checkout">Proceed to Checkout</Link>
                </Button>
                
                <div className="text-sm text-gray-500 text-center">
                  Secure checkout powered by Shopify
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
            <h3 className="text-xl font-medium mb-4">Your cart is empty</h3>
            <p className="text-gray-600 mb-6">Add items to your cart to begin checkout</p>
            <Button asChild>
              <Link to="/products">Start Shopping</Link>
            </Button>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default CartPage;
