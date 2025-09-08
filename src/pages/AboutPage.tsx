
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Crown, Shield, Star, Sparkles } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-20 relative">
        <div className="relative h-[40vh] md:h-[50vh] bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1800&auto=format&fit=crop)' }}>
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="relative h-full container-custom flex flex-col justify-center text-white">
            <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4">About MERAKI</h1>
            <p className="text-lg md:text-xl max-w-xl">
              Your one-stop destination for luxury lifestyle items, curated with passion and precision.
            </p>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <section className="py-16 md:py-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-playfair text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-700 mb-4">
                Founded in 2010, MERAKI began with a simple mission: to be the ultimate destination for discerning individuals seeking exceptional quality across all aspects of their lifestyle. Our journey started with a vision to curate the world's finest products under one roof.
              </p>
              <p className="text-gray-700 mb-4">
                What began as a passion for exceptional craftsmanship has evolved into a comprehensive luxury marketplace. We carefully select each item in our collection, from handcrafted leather goods to cutting-edge electronics, ensuring every product meets our exacting standards of quality and style.
              </p>
              <p className="text-gray-700">
                Today, MERAKI offers over 20 unique products across four distinct categories, each chosen for its superior quality, timeless design, and exceptional value. Our commitment to excellence and our customers' discerning tastes drives everything we do, making us the premier destination for luxury lifestyle essentials.
              </p>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop" 
                alt="Luxury store interior" 
                className="rounded-lg shadow-lg"
              />
              <div className="absolute -bottom-8 -left-8 hidden md:block">
                <img 
                  src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=400&auto=format&fit=crop" 
                  alt="Premium leather goods" 
                  className="rounded-lg shadow-md w-64 h-auto border-4 border-white"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-14">
            <h2 className="font-playfair text-3xl font-bold mb-4">Why MERAKI</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our commitment to quality, tradition, and sustainability sets us apart in every product we curate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="text-primary mb-4">
                <Crown size={36} strokeWidth={1.5} />
              </div>
              <h3 className="font-playfair text-xl font-semibold mb-3">Premium Quality</h3>
              <p className="text-gray-600">
                We curate only the finest products, ensuring every item meets our exacting standards of excellence and craftsmanship.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="text-primary mb-4">
                <Shield size={36} strokeWidth={1.5} />
              </div>
              <h3 className="font-playfair text-xl font-semibold mb-3">Authenticity</h3>
              <p className="text-gray-600">
                Every product is carefully vetted for authenticity, ensuring you receive genuine luxury items that stand the test of time.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="text-primary mb-4">
                <Star size={36} strokeWidth={1.5} />
              </div>
              <h3 className="font-playfair text-xl font-semibold mb-3">Exclusivity</h3>
              <p className="text-gray-600">
                We offer carefully selected, limited-edition items and refurbished treasures that you won't find anywhere else.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="text-primary mb-4">
                <Sparkles size={36} strokeWidth={1.5} />
              </div>
              <h3 className="font-playfair text-xl font-semibold mb-3">Curated Selection</h3>
              <p className="text-gray-600">
                Our expert team handpicks each item, creating a carefully curated collection that reflects the latest trends and timeless classics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="py-16 md:py-24">
        <div className="container-custom">
          <div className="text-center mb-14">
            <h2 className="font-playfair text-3xl font-bold mb-4">Our Process</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From sourcing to delivery, excellence guides every step of our curation process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop" 
                alt="Product sourcing" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="font-playfair text-xl font-semibold mb-3">1. Curated Selection</h3>
                <p className="text-gray-600">
                  We partner with renowned brands and artisans worldwide, selecting only the finest leather goods, electronics, fragrances, and refurbished items that meet our exacting standards.
                </p>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop" 
                alt="Quality inspection" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="font-playfair text-xl font-semibold mb-3">2. Quality Assurance</h3>
                <p className="text-gray-600">
                  Every item undergoes rigorous inspection and authentication, ensuring authenticity, functionality, and condition meet our premium standards before reaching our customers.
                </p>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop" 
                alt="Luxury presentation" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="font-playfair text-xl font-semibold mb-3">3. Luxury Experience</h3>
                <p className="text-gray-600">
                  Each product is carefully packaged and presented with the attention to detail our customers expect, creating an exceptional unboxing and ownership experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="container-custom text-center text-white">
          <h2 className="font-playfair text-3xl font-bold mb-6">Discover Luxury Redefined</h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-8">
            Experience why discerning customers choose MERAKI as their premier destination for luxury lifestyle essentials.
          </p>
          <a href="/products" className="bg-white text-primary font-mono uppercase px-8 py-3 rounded-sm hover:bg-white/90 transition-colors">
            Explore Our Collection
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
