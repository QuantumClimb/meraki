
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductDetails from '../components/ProductDetails';
import ProductCard from '../components/ProductCard';
import { Separator } from '@/components/ui/separator';

const ProductPage = () => {
  const { handle } = useParams<{ handle: string }>();
  const { products, getProductByHandle, isLoading } = useProducts();
  const navigate = useNavigate();
  
  const product = handle ? getProductByHandle(handle) : null;
  
  useEffect(() => {
    if (!isLoading && !product) {
      navigate('/404');
    }

    // Update page title for SEO
    if (product) {
      document.title = product.seo_title || `${product.title} | Puremills`;
    }
    
    // Scroll to top when product changes
    window.scrollTo(0, 0);
  }, [product, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container-custom py-32">
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse text-xl">Loading product...</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return null; // Will redirect in useEffect
  }

  // Find related products based on tags
  const relatedProducts = products
    .filter(p => p.id !== product.id && p.tags.some(tag => product.tags.includes(tag)))
    .slice(0, 3);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-20">
        <ProductDetails product={product} />
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h3 className="font-playfair text-2xl font-bold">You May Also Like</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default ProductPage;
