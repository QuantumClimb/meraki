import { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { Search, Filter } from 'lucide-react';

interface CategoryPageProps {
  category: string;
  categoryTitle: string;
  categoryDescription: string;
}

const CategoryPage = ({ category, categoryTitle, categoryDescription }: CategoryPageProps) => {
  const { products, isLoading } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');

  // Filter products by category
  const categoryProducts = products.filter(product => product.category === category);

  // Extract unique subcategories from category products
  const subcategories = isLoading
    ? ['All']
    : ['All', ...new Set(categoryProducts.map(product => product.subcategory))].sort();

  // Filter products based on search, subcategory, and sort
  const filteredProducts = isLoading
    ? []
    : categoryProducts.filter(product => {
        const matchesSearch = searchTerm === '' || 
          product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesSubcategory = selectedSubcategory === 'All' || 
          product.subcategory === selectedSubcategory;
        
        return matchesSearch && matchesSubcategory;
      }).sort((a, b) => {
        switch (sortBy) {
          case 'price-low':
            return a.price - b.price;
          case 'price-high':
            return b.price - a.price;
          case 'name':
            return a.title.localeCompare(b.title);
          default:
            return 0;
        }
      });

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-24 pb-12 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-8">
            <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-4">{categoryTitle}</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {categoryDescription}
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-center mb-8">
            <div className="w-full lg:w-1/2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder={`Search ${categoryTitle.toLowerCase()}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="flex gap-4 w-full lg:w-auto">
              <select
                value={selectedSubcategory}
                onChange={(e) => setSelectedSubcategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
              >
                {subcategories.map((subcategory) => (
                  <option key={subcategory} value={subcategory}>
                    {subcategory}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <section className="py-16">
        <div className="container-custom">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 9 }).map((_, index) => (
                <div key={index} className="bg-gray-100 animate-pulse rounded-lg h-96"></div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-600">
                  Showing {filteredProducts.length} of {categoryProducts.length} products
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
              <button 
                className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedSubcategory('All');
                }}
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CategoryPage;
