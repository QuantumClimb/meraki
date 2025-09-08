
import { ArrowDown } from 'lucide-react';

interface HeroBannerProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaAction: () => void;
  backgroundImage?: string;
}

const HeroBanner = ({ 
  title, 
  subtitle, 
  ctaText, 
  ctaAction,
  backgroundImage = "https://images.unsplash.com/photo-1568051242478-5e68c17c9998?q=80&w=1800&auto=format&fit=crop"
}: HeroBannerProps) => {
  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-fixed"
        style={{ 
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative container-custom z-10 text-white text-center">
        <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 max-w-3xl mx-auto">
          {title}
        </h1>
        <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10">
          {subtitle}
        </p>
        <button 
          onClick={ctaAction}
          className="btn-primary rounded-sm animate-fade-in"
        >
          {ctaText}
        </button>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <button 
          onClick={ctaAction}
          className="flex flex-col items-center text-white/80 hover:text-white transition-colors"
        >
          <span className="text-xs uppercase font-mono tracking-wider mb-2">Discover</span>
          <ArrowDown size={20} />
        </button>
      </div>
    </div>
  );
};

export default HeroBanner;
