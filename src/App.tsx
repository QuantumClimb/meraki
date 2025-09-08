
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import Index from "./pages/Index";
import ProductPage from "./pages/ProductPage";
import ProductsPage from "./pages/ProductsPage";
import CategoryPage from "./pages/CategoryPage";
import AboutPage from "./pages/AboutPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import WishlistPage from "./pages/WishlistPage";
import AccountPage from "./pages/AccountPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/leather-goods" element={<CategoryPage category="Leather Goods" categoryTitle="Leather Goods" categoryDescription="Handcrafted leather accessories and bags made from premium materials." />} />
            <Route path="/products/electronics" element={<CategoryPage category="Electronics" categoryTitle="Electronics" categoryDescription="Cutting-edge technology and gadgets for modern living." />} />
            <Route path="/products/fragrances" element={<CategoryPage category="Fragrances" categoryTitle="Fragrances" categoryDescription="Curated scents for men, women, and unisex preferences." />} />
            <Route path="/products/used-refurbished" element={<CategoryPage category="Used/Refurbished" categoryTitle="Used & Refurbished" categoryDescription="Quality restored items at exceptional value." />} />
            <Route path="/product/:handle" element={<ProductPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;
