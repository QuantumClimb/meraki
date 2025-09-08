import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ShoppingBag, Heart, User, MessageSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useCart } from '../contexts/CartContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { state } = useCart();
  
  const cartItemCount = state.items.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/your-number', '_blank');
  };

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container-custom flex items-center justify-between">
        <Link to="/" className="font-playfair text-2xl font-bold text-primary">
          MERAKI
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/products/leather-goods" className="hover:text-primary transition-colors">
            Leather Goods
          </Link>
          <Link to="/products/electronics" className="hover:text-primary transition-colors">
            Electronics
          </Link>
          <Link to="/products/fragrances" className="hover:text-primary transition-colors">
            Fragrances
          </Link>
          <Link to="/products/used-refurbished" className="hover:text-primary transition-colors">
            Used/Refurbished
          </Link>
          <Link to="/about" className="hover:text-primary transition-colors">
            About
          </Link>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 ml-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleWhatsAppClick}
              className="text-green-600 hover:text-green-700"
            >
              <MessageSquare className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link to="/wishlist">
                <Heart className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link to="/account">
                <User className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild className="relative">
              <Link to="/cart">
                <ShoppingBag className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </Button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="relative">
            <Link to="/cart">
              <ShoppingBag className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </Button>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            className="text-gray-800"
          >
            {isMobileMenuOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-md py-4 px-6 flex flex-col space-y-4 animate-fade-in">
          <Link 
            to="/" 
            className="hover:text-primary transition-colors py-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/products/leather-goods" 
            className="hover:text-primary transition-colors py-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Leather Goods
          </Link>
          <Link 
            to="/products/electronics" 
            className="hover:text-primary transition-colors py-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Electronics
          </Link>
          <Link 
            to="/products/fragrances" 
            className="hover:text-primary transition-colors py-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Fragrances
          </Link>
          <Link 
            to="/products/used-refurbished" 
            className="hover:text-primary transition-colors py-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Used/Refurbished
          </Link>
          <Link 
            to="/about" 
            className="hover:text-primary transition-colors py-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            About
          </Link>
          <Link 
            to="/wishlist" 
            className="hover:text-primary transition-colors py-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Wishlist
          </Link>
          <Link 
            to="/account" 
            className="hover:text-primary transition-colors py-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Account
          </Link>
          <button 
            onClick={handleWhatsAppClick}
            className="flex items-center gap-2 text-green-600 hover:text-green-700"
          >
            <MessageSquare className="h-5 w-5" />
            <span>Contact on WhatsApp</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
