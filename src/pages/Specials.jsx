import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useAdmin } from "@/context/AdminContext";

import bgImage from "@/assets/sarees/pt6.jfif"; // Fallback background

const Specials = () => {
  const { products: PRODUCTS, specialsCategories: LIVE_CATEGORIES } = useAdmin();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  useEffect(() => {
    const category = searchParams.get("category");
    if (category) {
      setActiveCategory(category);
    } else {
      setActiveCategory("All");
    }
  }, [searchParams]);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    const currentParams = new URLSearchParams(searchParams);
    if (category === "All") {
      currentParams.delete("category");
    } else {
      currentParams.set("category", category);
    }
    setSearchParams(currentParams);
  };

  const displayedCategories = activeCategory === "All" 
    ? LIVE_CATEGORIES 
    : LIVE_CATEGORIES.filter(c => c.name === activeCategory || c.id === activeCategory);

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      {/* Hero Section */}
      <section className="relative h-[60vh] lg:h-[70vh] flex items-center justify-center overflow-hidden mb-12">
        <div className="absolute inset-0 z-0">
          <img src={bgImage} alt="Specials Background" className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/40 to-background"></div>
        </div>
        
        <div className="relative z-10 text-center px-6 pt-16">
          <div className="text-[10px] uppercase tracking-[0.4em] text-gold mb-6 font-semibold">
            — The Edit
          </div>
          <h1 className="text-5xl md:text-7xl mb-6">
            <span className="font-serif text-white mr-4">Our</span>
            <span className="font-script text-gold">Specials</span>
          </h1>
                    <p className="text-white/80 font-serif italic text-lg md:text-xl mb-10">
            Four traditions, hundreds of drapes, one curated trunk.
          </p>
                    <Link 
            to="/collections" 
            className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-gold to-gold-deep text-white px-10 py-4 rounded-full uppercase text-xs tracking-[0.2em] font-bold shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] hover:scale-105 transition-all duration-500 overflow-hidden"
          >
            <span className="relative z-10">View Collection</span>
            <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out"></div>
          </Link>
        </div>
      </section>

      {/* Static Tab Filters */}
      <div className="py-8 mb-4 border-b border-border/50 overflow-x-auto hide-scrollbar">
        <div className="flex items-center justify-center gap-3 w-max mx-auto px-6">
          <button
            onClick={() => handleCategoryChange("All")}
            className={`px-6 py-2 rounded-full text-[10px] uppercase tracking-widest transition-all duration-300 ${
              activeCategory === "All" 
                ? "bg-primary text-white border border-primary" 
                : "bg-transparent text-muted-foreground border border-gray-300 hover:border-primary hover:text-primary"
            }`}
          >
            All
          </button>
          
          {LIVE_CATEGORIES.map(category => {
            const isActive = activeCategory === category.id || activeCategory === category.name;
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`px-6 py-2 rounded-full text-[10px] uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${
                  isActive
                    ? "bg-primary text-white border border-primary" 
                    : "bg-transparent text-muted-foreground border border-gray-300 hover:border-primary hover:text-primary"
                }`}
              >
                {category.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* Category Sections */}
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 py-20">
        {displayedCategories.map((cat, idx) => {
          // Find products for this category
          const categoryProducts = PRODUCTS.filter(p => p.category === cat.id || p.category.includes(cat.name.split(' ')[0]));
          
          if (categoryProducts.length === 0) return null;

          return (
            <motion.div 
              key={cat.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="mb-32 last:mb-16"
            >
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-8 max-w-5xl mx-auto">
                <div>
                  <div className="text-gold text-sm tracking-[0.3em] font-semibold mb-4">
                    — 0{idx + 1}
                  </div>
                  <h2 className="font-serif text-5xl md:text-6xl text-primary mb-2">
                    {cat.name}
                  </h2>
                  <div className="font-script text-gold text-3xl md:text-4xl">
                    {cat.subtitle}
                  </div>
                </div>
                <div className="lg:max-w-md text-muted-foreground text-sm leading-relaxed lg:text-left mt-2 lg:mt-0">
                  <p>{cat.desc}</p>
                </div>
              </div>

              {/* Clean Image Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 max-w-5xl mx-auto mt-8">
                {categoryProducts.map((product) => (
                  <Link to={`/product/${product.id}`} key={product.id} className="block group cursor-pointer shadow-sm hover:shadow-xl transition-shadow duration-500 bg-white rounded overflow-hidden">
                    <div className="overflow-hidden aspect-[3/4]">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="py-24 bg-primary/5 text-center px-6">
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px w-16 bg-gold/50"></div>
          <div className="w-3 h-3 rotate-45 bg-gold shadow-[0_0_10px_rgba(212,175,55,0.5)]"></div>
          <div className="h-px w-16 bg-gold/50"></div>
        </div>
        
        <h2 className="font-serif text-4xl md:text-5xl text-primary mb-6">
          Found one calling your name?
        </h2>
        <p className="text-primary/70 font-serif italic text-lg md:text-xl mb-10">
          We'll bring it home for a closer look.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            to="/contact" 
            className="inline-block bg-primary text-white text-[11px] uppercase tracking-[0.3em] font-semibold px-10 py-4 rounded-full hover:bg-gold transition-colors duration-300 shadow-xl shadow-primary/20"
          >
            Request A Home Visit
          </Link>
          <Link 
            to="/collections" 
            className="inline-block bg-white text-primary border border-primary text-[11px] uppercase tracking-[0.3em] font-semibold px-10 py-4 rounded-full hover:bg-primary hover:text-white transition-colors duration-300"
          >
            Go to Collections
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Specials;


