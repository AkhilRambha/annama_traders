import { useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useAdmin } from "@/context/AdminContext";
import { ProductCard } from "@/components/ecommerce/ProductCard";

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=2000&auto=format&fit=crop"
];

export default function Jewellery() {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);

  const { products } = useAdmin();
  const jewelleryItems = products.filter(p => p.category === "Jewellery");

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 4000); // Change image every 4 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-background min-h-screen text-foreground pt-20">

      {/* HERO SECTION */}
      <section className="relative h-[80vh] md:h-[90vh] overflow-hidden bg-primary text-primary-foreground">
        <motion.div style={{ y: y1 }} className="absolute inset-0">
          <AnimatePresence>
            <motion.img
              key={currentImageIndex}
              src={HERO_IMAGES[currentImageIndex]}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              alt="Jewellery Hero"
              className="absolute inset-0 w-full h-full object-cover "
            />
          </AnimatePresence>
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-4xl"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Sparkles size={16} className="text-gold" />
              <span className="text-xs uppercase tracking-[0.4em] text-gold-deep font-bold">The Royal Collection</span>
              <Sparkles size={16} className="text-gold" />
            </div>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white font-bold drop-shadow-xl mb-6 leading-tight">
              Exquisite <em className="font-script gold-text not-italic">Adornments</em>
            </h1>
            <p className="font-medium text-white text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10 drop-shadow-md">
              Discover a curated selection of handcrafted Kundan, Polki, and Temple jewellery, designed for the modern royal.
            </p>
          </motion.div>
        </div>
      </section>

      {/* SHOP BY CATEGORY */}
      <section className="py-10 lg:py-15 max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-16">
          <div className="text-xs uppercase tracking-[0.4em] text-gold-deep mb-4">Curated Edits</div>
          <h2 className="font-serif text-4xl md:text-5xl text-primary">Shop by <em className="font-script gold-text not-italic">Category</em></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {[
            { title: "Necklaces & Chokers", img: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=800&auto=format&fit=crop" },
            { title: "Statement Earrings", img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop" },
            { title: "Bangles & Bracelets", img: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?q=80&w=800&auto=format&fit=crop" }
          ].map((cat, i) => (
            <Link key={i} to="/collections" className="group relative h-[300px] md:h-[350px] overflow-hidden rounded-2xl block">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500 z-10" />
              <img
                src={cat.img}
                alt={cat.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-0 left-0 w-full p-8 z-20">
                <h3 className="text-2xl font-serif text-white mb-2">{cat.title}</h3>
                <span className="inline-flex items-center text-white/80 text-sm group-hover:text-white transition-colors">
                  Explore <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ALL JEWELLERY */}
      <section className="py-20 lg:py-28 max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-end justify-between mb-16 flex-wrap gap-6">
          <div>
            <div className="text-xs uppercase tracking-[0.4em] text-gold-deep mb-4">Complete Range</div>
            <h2 className="font-serif text-4xl md:text-5xl text-primary">The <em className="font-script gold-text not-italic">Collection.</em></h2>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
          {jewelleryItems.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </section>

    </div>
  );
}







