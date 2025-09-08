import { useState } from 'react';
import { Type, ShoppingCart } from 'lucide-react';
import { Product } from '../hooks/useProducts';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ProductDetailsProps {
  product: Product;
}

const ProductDetails = ({ product }: ProductDetailsProps) => {
  const [selectedImage, setSelectedImage] = useState(product.image);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const galleryImages = [
    product.image,
    "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=800",
    "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800",
    "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800"
  ];

  const price = product.price || 1249;

  return (
    <div className="container-custom py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
            <DialogTrigger asChild>
              <button className="w-full overflow-hidden rounded-lg cursor-zoom-in">
                <img
                  src={selectedImage}
                  alt={product.title}
                  className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-500"
                />
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <img
                src={selectedImage}
                alt={product.title}
                className="w-full h-auto object-contain"
              />
            </DialogContent>
          </Dialog>
          
          <div className="grid grid-cols-4 gap-4">
            {galleryImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(image)}
                className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImage === image ? 'border-primary' : 'border-transparent'
                }`}
              >
                <img
                  src={image}
                  alt={`Product view ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            {product.tags.map((tag, index) => (
              <span key={index} className="badge">{tag}</span>
            ))}
          </div>
          
          <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-4">{product.title}</h1>
          
          <div className="mb-6">
            <p className="text-gray-700">{product.description}</p>
          </div>

          <div className="mb-6">
            <p className="text-2xl font-playfair font-bold text-primary">₹{price.toLocaleString('en-IN')}</p>
          </div>
          
          <div className="mb-8">
            <h3 className="font-playfair text-xl font-semibold mb-3">Highlights</h3>
            <ul className="space-y-2">
              {product.highlights.map((highlight, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-primary mr-2 mt-1">•</span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          <Accordion type="single" collapsible className="mb-8">
            <AccordionItem value="nutritional-info">
              <AccordionTrigger className="font-playfair text-lg">
                Nutritional Information
              </AccordionTrigger>
              <AccordionContent>
                <p className="whitespace-pre-line">{product.nutritional_info}</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="ingredients">
              <AccordionTrigger className="font-playfair text-lg">
                Ingredients
              </AccordionTrigger>
              <AccordionContent>
                <p>{product.ingredients}</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="preparation">
              <AccordionTrigger className="font-playfair text-lg">
                Preparation & Uses
              </AccordionTrigger>
              <AccordionContent>
                <p>{product.preparation}</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="sticky bottom-8 md:relative md:bottom-auto w-full space-y-4">
            <Button className="w-full" variant="default">
              <ShoppingCart className="mr-2" size={18} />
              Add to Cart
            </Button>
            <Button className="w-full" variant="outline">
              <Type className="mr-2" size={18} />
              Buy from partner site
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
