
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart, removeFromCart, updateQuantity } from '../contexts/CartContext';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

const CartPage = () => {
  const { state, dispatch } = useCart();
  const cartProducts = state.items;

  const handleUpdateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      dispatch(removeFromCart(productId));
    } else {
      dispatch(updateQuantity(productId, newQuantity));
    }
  };

  const handleRemoveFromCart = (productId: number) => {
    dispatch(removeFromCart(productId));
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  // Calculate totals
  const subtotal = cartProducts.reduce((total, item) => {
    return total + (item.quantity * (item.product.price || 1249));
  }, 0);
  
  const estimatedTax = subtotal * 0.18;
  const total = subtotal + estimatedTax;

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container-custom pt-28 pb-20">
        <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-4">Shopping Cart</h1>
        
        {cartProducts.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {cartProducts.map((item) => (
                  <div key={item.product.id} className="flex flex-col sm:flex-row items-start sm:items-center p-4 border-b border-gray-200 last:border-b-0">
                    <div className="sm:w-20 sm:h-20 mb-4 sm:mb-0 sm:mr-4">
                      <img 
                        src={item.product.image} 
                        alt={item.product.title} 
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                    
                    <div className="flex-grow">
                      <Link to={`/product/${item.product.handle}`} className="font-medium hover:text-primary">
                        {item.product.title}
                      </Link>
                      <div className="text-sm text-gray-500 mt-1">
                        ₹{(item.product.price || 1249).toLocaleString('en-IN')} each
                      </div>
                    </div>
                    
                    <div className="flex items-center mt-4 sm:mt-0">
                      <button 
                        onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 border border-gray-300 rounded-l"
                      >
                        <Minus size={16} />
                      </button>
                      <div className="px-3 py-1 border-y border-gray-300">
                        {item.quantity}
                      </div>
                      <button 
                        onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 border border-gray-300 rounded-r"
                      >
                        <Plus size={16} />
                      </button>
                      
                      <div className="ml-4 font-medium">
                        ₹{((item.product.price || 1249) * item.quantity).toLocaleString('en-IN')}
                      </div>
                      
                      <button 
                        onClick={() => handleRemoveFromCart(item.product.id)}
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
