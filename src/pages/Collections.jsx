import { useState, useMemo, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/ecommerce/ProductCard";
import { useAdmin } from "@/context/AdminContext";
import { DRESS_CATEGORY_CARDS } from "@/data/dressProducts";

function CollectionsPage() {
  const { products: PRODUCTS, categories: CATEGORIES } = useAdmin();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const searchQuery = searchParams.get("q") || "";
  
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
    
    // Preserve search query if it exists
    const currentParams = new URLSearchParams(searchParams);
    
    if (category === "All") {
      currentParams.delete("category");
    } else {
      currentParams.set("category", category);
    }
    
    setSearchParams(currentParams);
  };

  const clearSearch = () => {
    const currentParams = new URLSearchParams(searchParams);
    currentParams.delete("q");
    setSearchParams(currentParams);
  };

  const filteredProducts = useMemo(() => {
    let result = PRODUCTS; // AdminContext already includes ALL_DRESS_PRODUCTS
    
    if (activeCategory !== "All") {
      result = result.filter(p => p.category === activeCategory);
    }
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q) ||
        (p.id || "").toLowerCase().includes(q)
      );
    }
    
    return result;
  }, [PRODUCTS, activeCategory, searchQuery]);

  return (
    <div className="min-h-screen pt-36 pb-24 px-6 lg:px-10 max-w-screen-2xl mx-auto flex flex-col">
      
      {/* Header & Title */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="font-serif text-5xl md:text-6xl text-primary mb-4">Our Collections</h1>
        <p className="text-muted-foreground text-lg">
          Discover our hand-picked selection of authentic Indian sarees. 
          From Kanchi Pattu to modern designer drapes, find your perfect style.
        </p>
      </div>

      {/* Top Filter Bar */}
      <div className="sticky top-[110px] z-30 bg-background/90 backdrop-blur-md py-4 mb-10 border-b border-border overflow-x-auto hide-scrollbar">
        <div className="flex items-center gap-3 w-max mx-auto px-4">
          <button
            onClick={() => handleCategoryChange("All")}
            className={`px-6 py-2.5 rounded-full text-xs uppercase tracking-widest transition whitespace-nowrap ${
              activeCategory === "All" 
                ? "bg-primary text-primary-foreground shadow-md" 
                : "bg-accent/10 text-muted-foreground hover:bg-accent/20 hover:text-primary"
            }`}
          >
            All Items
          </button>
          
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-6 py-2.5 rounded-full text-xs uppercase tracking-widest transition whitespace-nowrap ${
                activeCategory === category 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "bg-accent/10 text-muted-foreground hover:bg-accent/20 hover:text-primary"
              }`}
            >
              {category}
            </button>
          ))}

          <div className="w-px h-6 bg-border/50 mx-2 hidden md:block" />

          {DRESS_CATEGORY_CARDS.map(cat => (
            <button
              key={cat.name}
              onClick={() => handleCategoryChange(cat.name)}
              className={`px-6 py-2.5 rounded-full text-xs uppercase tracking-widest transition whitespace-nowrap ${
                activeCategory === cat.name 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "bg-accent/10 text-muted-foreground hover:bg-accent/20 hover:text-primary"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-8">
        <p className="text-muted-foreground text-sm uppercase tracking-wider">
          Showing <span className="font-bold text-primary">{filteredProducts.length}</span> results
        </p>
      </div>

      {/* Main Product Grid */}
      <main>
        {filteredProducts.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-8"
          >
            <AnimatePresence>
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                >
                  <ProductCard product={product} index={index} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="py-32 text-center flex flex-col items-center justify-center bg-accent/5 rounded-sm border border-border">
            <Filter size={48} className="text-gold mb-4 opacity-50" />
            <h3 className="font-serif text-2xl text-primary mb-2">No products found</h3>
            <p className="text-muted-foreground mb-6">
              We couldn't find any products matching your search criteria.
            </p>
            <div className="flex gap-4">
              {searchQuery && (
                <button 
                  onClick={clearSearch}
                  className="px-8 py-3 bg-gold text-white hover:bg-gold-deep transition rounded-full uppercase text-xs tracking-widest shadow-md"
                >
                  Clear Search
                </button>
              )}
              {activeCategory !== "All" && (
                <button 
                  onClick={() => handleCategoryChange("All")}
                  className="px-8 py-3 border border-gold text-gold-deep hover:bg-gold hover:text-white transition rounded-full uppercase text-xs tracking-widest shadow-md"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      {/* ── Dresses Quick Links ─────────────────────────────── */}
      {/* ── DRESSES COLLECTION ─────────────────────────────── */}
      {activeCategory === "All" && !searchQuery && (
        <div className="mt-24 pt-16 border-t border-border">
          <div className="text-center mb-10">
            <h2 className="font-serif text-5xl md:text-6xl text-primary">DRESSES</h2>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-8">
            {DRESS_CATEGORY_CARDS.map((cat, index) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: (index % 4) * 0.1 }}
                className="group relative flex flex-col bg-background rounded-sm shadow-sm hover:shadow-luxe transition duration-500 overflow-hidden border border-border"
              >
                {/* Image Section - Matches ProductCard exactly */}
                <div className="relative aspect-square overflow-hidden bg-accent/10">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-in-out"
                    loading="lazy"
                  />
                  
                  {/* Hover Actions - Just Quick View to match style */}
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Link 
                      to={`/dresses/${cat.id}`}
                      className="w-12 h-12 rounded-full bg-white text-primary flex items-center justify-center shadow-lg hover:scale-110 hover:bg-gold hover:text-white transition"
                      aria-label="View Category"
                    >
                      <ArrowRight size={20} />
                    </Link>
                  </div>
                </div>

                {/* Details Section - Matches ProductCard exactly */}
                <div className="p-3 md:p-5 flex flex-col flex-1">
                  <div className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1 line-clamp-1">
                    DRESSES
                  </div>
                  <h3 className="font-serif text-sm md:text-lg text-primary line-clamp-1 md:line-clamp-2 mb-2 group-hover:text-gold-deep transition-colors">
                    {cat.name}
                  </h3>
                  <div className="mt-auto flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0">
                    <Link 
                      to={`/dresses/${cat.id}`}
                      className="text-primary font-medium text-xs md:text-base hover:text-gold transition flex items-center gap-1"
                    >
                      View Collection <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CollectionsPage;
