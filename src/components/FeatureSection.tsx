
import { Crown, Shield, Star } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center">
      <div className="text-primary mb-4">
        {icon}
      </div>
      <h3 className="font-playfair text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const FeatureSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-14">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4">Why MERAKI</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our commitment to quality, authenticity, and exclusivity sets us apart in every product we curate.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Crown size={40} strokeWidth={1.5} />}
            title="Premium Quality"
            description="We curate only the finest products, ensuring every item meets our exacting standards of excellence and craftsmanship."
          />
          <FeatureCard 
            icon={<Shield size={40} strokeWidth={1.5} />}
            title="Authenticity Guaranteed"
            description="Every product is carefully vetted for authenticity, ensuring you receive genuine luxury items that stand the test of time."
          />
          <FeatureCard 
            icon={<Star size={40} strokeWidth={1.5} />}
            title="Exclusive Selection"
            description="Our expert team handpicks each item, creating a carefully curated collection that reflects the latest trends and timeless classics."
          />
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
