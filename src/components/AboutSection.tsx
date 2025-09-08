
const AboutSection = () => {
  return (
    <section className="py-20">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop" 
              alt="MERAKI luxury store interior" 
              className="rounded-lg shadow-md w-full h-auto"
            />
            <div className="absolute -bottom-8 -right-8 hidden md:block">
              <img 
                src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=400&auto=format&fit=crop" 
                alt="Premium leather goods" 
                className="rounded-lg shadow-md w-64 h-auto border-4 border-white"
              />
            </div>
          </div>
          
          <div className="md:pl-8">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
            <p className="text-gray-700 mb-4">
              Founded in 2010, MERAKI began with a simple mission: to be the ultimate destination for discerning individuals seeking exceptional quality across all aspects of their lifestyle. Our journey started with a vision to curate the world's finest products under one roof.
            </p>
            <p className="text-gray-700 mb-6">
              Today, we offer over 20 unique products across four distinct categories - from handcrafted leather goods to cutting-edge electronics, exclusive fragrances, and carefully restored refurbished items - each chosen for its superior quality, timeless design, and exceptional value.
            </p>
            <button className="btn-outline">Learn More About Us</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
