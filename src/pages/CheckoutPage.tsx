
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart, completePurchase } from '../contexts/CartContext';
import { Lock } from 'lucide-react';
import { Button } from "@/components/ui/button";

const CheckoutPage = () => {
  const { state, dispatch } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const cartProducts = state.items;
  
  // Calculate totals
  const subtotal = cartProducts.reduce((total, item) => {
    return total + (item.quantity * (item.product.price || 1249));
  }, 0);
  
  const shipping = subtotal > 4000 ? 0 : 499;
  const estimatedTax = subtotal * 0.18;
  const total = subtotal + shipping + estimatedTax;

  const handlePlaceOrder = async () => {
    if (cartProducts.length === 0) return;
    
    setIsProcessing(true);
    
    try {
      // Create purchase record
      const purchase = {
        id: `purchase-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        items: cartProducts,
        total,
        timestamp: Date.now(),
        whatsappSent: true,
      };

      // Track purchase on server (optional)
      try {
        await fetch('/api/track-purchase', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(purchase),
        });
      } catch (error) {
        console.warn('Failed to track purchase on server:', error);
        // Continue with local tracking even if server fails
      }

      // Complete purchase locally
      dispatch(completePurchase(cartProducts, total));

      // Create WhatsApp message
      const phoneNumber = '+919789909362';
      const orderItems = cartProducts.map(item => 
        `${item.product.title} (Qty: ${item.quantity})`
      ).join(', ');
      
      const orderMessage = `Hi, I am interested in ${orderItems} with the cost ₹${total.toLocaleString('en-IN')}.`;
      
      const encodedMessage = encodeURIComponent(orderMessage);
      const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${encodedMessage}`;
      
      // Open WhatsApp
      window.open(whatsappUrl, '_blank');
      
    } catch (error) {
      console.error('Error processing order:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartProducts.length === 0) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container-custom pt-28 pb-20">
          <div className="text-center py-12">
            <h1 className="font-playfair text-3xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Add some items to your cart to proceed with checkout.</p>
            <Link to="/products" className="btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container-custom pt-28 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-6">Quick Checkout</h1>
            
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-medium mb-6">Order Summary</h2>
              <p className="text-gray-600 mb-6">
                Review your items below and click the button to send your order via WhatsApp. 
                Payment and shipping details will be handled directly with the supplier.
              </p>
              
              <div className="space-y-4 mb-6">
                {cartProducts.map((item) => (
                  <div key={item.product.id} className="flex items-center">
                    <div className="relative w-16 h-16 mr-4">
                      <img 
                        src={item.product.image} 
                        alt={item.product.title} 
                        className="w-full h-full object-cover rounded-md"
                      />
                      <div className="absolute -top-2 -right-2 bg-gray-200 text-xs w-5 h-5 rounded-full flex items-center justify-center">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm font-medium">{item.product.title}</p>
                      <p className="text-sm text-gray-500">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>
              
              <div className="mt-6">
                <Button 
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="w-full flex items-center justify-center"
                  size="lg"
                >
                  <Lock size={16} className="mr-2" />
                  {isProcessing ? 'Processing...' : 'Send Order via WhatsApp'}
                </Button>
                <p className="text-sm text-gray-500 text-center mt-2">
                  Order will be sent to supplier for payment and shipping details
                </p>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-medium mb-4">How it works</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                    1
                  </div>
                  <div>
                    <h3 className="font-medium">Review Items</h3>
                    <p className="text-sm text-gray-600">Check your selected items and total cost</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                    2
                  </div>
                  <div>
                    <h3 className="font-medium">Send via WhatsApp</h3>
                    <p className="text-sm text-gray-600">Click the button to send your order details</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                    3
                  </div>
                  <div>
                    <h3 className="font-medium">Complete Order</h3>
                    <p className="text-sm text-gray-600">Supplier will handle payment and shipping details</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/cart">Return to Cart</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CheckoutPage;
