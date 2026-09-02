import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/ecommerce/ProductCard";
import { useCart } from "@/context/CartContext";
import {
  DRESS_PRODUCTS,
  DRESS_CATEGORY_CARDS,
  DRESS_CATEGORIES_META,
} from "@/data/dressProducts";

// ─── DRESS CATEGORY PAGE ─────────────────────────────────────────────────────
const DressCategory = () => {
  const { category } = useParams();

  const meta     = DRESS_CATEGORIES_META[category] || DRESS_CATEGORIES_META["party-wear"];
  const catCard  = DRESS_CATEGORY_CARDS.find(c => c.id === category) || DRESS_CATEGORY_CARDS[0];
  const products = DRESS_PRODUCTS[category] || DRESS_PRODUCTS["party-wear"];

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="relative h-[42vh] lg:h-[52vh] flex items-center justify-center overflow-hidden mb-12">
        <div className="absolute inset-0 z-0">
          <img
            src={catCard.image}
            alt={catCard.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#72242C]/80 via-[#72242C]/50 to-background" />
        </div>
        <div className="relative z-10 text-center px-6 pt-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[10px] uppercase tracking-[0.4em] text-gold mb-4 font-semibold"
          >
            — Dresses
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="font-serif text-4xl md:text-6xl text-white mb-3"
          >
            {catCard.name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-white/80 font-serif italic text-lg md:text-xl max-w-2xl mx-auto"
          >
            {meta.subtitle}
          </motion.p>
        </div>
      </section>

      {/* ── Section Header ──────────────────────────────────── */}
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 gap-6"
        >
          <div>
            <div className="text-gold text-sm tracking-[0.3em] font-semibold mb-3">— Collection</div>
            <h2 className="font-serif text-5xl md:text-6xl text-primary">{catCard.name}</h2>
          </div>
          <p className="lg:max-w-md text-muted-foreground text-sm leading-relaxed">{catCard.desc}</p>
        </motion.div>

        {/* ── Product Grid ─────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-20">
          {products.map((product, idx) => (
            <ProductCard key={product.id} product={product} index={idx} bgColor={meta.bgColor} />
          ))}
        </div>
      </div>

      {/* ── Bottom CTA ──────────────────────────────────────── */}
      <div className="py-24 bg-primary/5 text-center px-6">
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px w-16 bg-gold/50" />
          <div className="w-3 h-3 rotate-45 bg-gold shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
          <div className="h-px w-16 bg-gold/50" />
        </div>
        <h2 className="font-serif text-4xl md:text-5xl text-primary mb-4">Found one calling your name?</h2>
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
            to="/dresses"
            className="inline-block bg-white text-primary border border-primary text-[11px] uppercase tracking-[0.3em] font-semibold px-10 py-4 rounded-full hover:bg-primary hover:text-white transition-colors duration-300"
          >
            View All Dresses
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DressCategory;
