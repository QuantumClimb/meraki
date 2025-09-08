import React, { useRef } from 'react';
import { useProducts } from '../hooks/useProducts';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BannerCarousel from '../components/BannerCarousel';
import ProductCard from '../components/ProductCard';
import AboutSection from '../components/AboutSection';
import FeatureSection from '../components/FeatureSection';

const Index = () => {
  const { products, isLoading } = useProducts();
  const productsRef = useRef<HTMLDivElement>(null);

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section with Carousel */}
      <BannerCarousel />

      {/* Product Grid */}
      <section ref={productsRef} className="py-20">
        <div className="container-custom">
          <div className="text-center mb-14">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our curated selection of premium lifestyle products across leather goods, electronics, fragrances, and refurbished items.
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-gray-100 animate-pulse rounded-lg h-96"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <a href="/products" className="btn-outline">
              View All Products
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <AboutSection />

      {/* Feature Section */}
      <FeatureSection />

      <Footer />
    </div>
  );
};

export default Index;
