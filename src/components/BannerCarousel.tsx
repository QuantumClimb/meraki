
import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const bannerSlides = [
  {
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1800",
    title: "Premium Leather Goods",
    description: "Handcrafted accessories for the discerning lifestyle"
  },
  {
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1800",
    title: "Cutting-Edge Electronics",
    description: "Latest technology meets exceptional quality"
  },
  {
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=1800",
    title: "Exclusive Fragrances",
    description: "Curated scents for every personality"
  },
  {
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1800",
    title: "Refurbished Excellence",
    description: "Quality restored, value redefined"
  }
];

export const BannerCarousel = () => {
  return (
    <Carousel className="w-full">
      <CarouselContent>
        {bannerSlides.map((slide, index) => (
          <CarouselItem key={index}>
            <div className="relative h-[70vh] w-full overflow-hidden">
              <img
                src={slide.image}
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-center">
                <div className="text-white max-w-3xl px-4">
                  <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl mb-4">
                    {slide.title}
                  </h2>
                  <p className="text-lg md:text-xl text-white/90">
                    {slide.description}
                  </p>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-4" />
      <CarouselNext className="right-4" />
    </Carousel>
  );
};

export default BannerCarousel;
