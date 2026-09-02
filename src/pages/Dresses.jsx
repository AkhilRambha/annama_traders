import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { DRESS_CATEGORY_CARDS } from "@/data/dressProducts";
import dressesHeroBg from "@/assets/hero/dresses_hero_bg.jpg";

const Dresses = () => {
  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative h-[60vh] lg:h-[70vh] flex items-center justify-center overflow-hidden mb-4">
        <div className="absolute inset-0 z-0">
          <img
            src={dressesHeroBg}
            alt="Dresses Collection Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#72242C]/80 via-[#72242C]/50 to-background" />
        </div>

        <div className="relative z-10 text-center px-6 pt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-[10px] uppercase tracking-[0.4em] text-gold mb-6 font-semibold"
          >
            — The Collection
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-5xl md:text-7xl mb-6"
          >
            <span className="font-serif text-white mr-4">Elegant</span>
            <span className="font-script text-gold">Dresses</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-white/80 font-serif italic text-lg md:text-xl mb-10 max-w-2xl mx-auto"
          >
            Discover our premium curated collection of luxury Indian and Indo‑western dresses for every occasion.
          </motion.p>
        </div>
      </section>

      {/* ── Category Grid ─────────────────────────────────────── */}
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 py-10">
        <div className="text-center mb-14">
          <div className="text-gold text-sm tracking-[0.3em] font-semibold mb-4">— Browse By Category</div>
          <h2 className="font-serif text-4xl md:text-5xl text-primary">Shop the Collection</h2>
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="h-px w-16 bg-gold/40" />
            <div className="w-2 h-2 rotate-45 bg-gold/70" />
            <div className="h-px w-16 bg-gold/40" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {DRESS_CATEGORY_CARDS.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="group cursor-pointer flex flex-col"
            >
              <Link to={`/dresses/${cat.id}`} className="flex flex-col flex-1">
                <div className="overflow-hidden aspect-[3/4] rounded-sm mb-6 relative">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-[#72242C]/10 group-hover:bg-transparent transition duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#72242C]/80 to-transparent p-5 translate-y-1 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-white/85 text-xs font-serif italic">{cat.desc}</p>
                  </div>
                </div>
                <div className="text-center flex-1 flex flex-col">
                  <h3 className="font-serif text-3xl text-primary mb-3 group-hover:text-gold transition-colors duration-300">
                    {cat.name}
                  </h3>
                  <span className="inline-flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-primary font-semibold group-hover:text-gold transition-colors duration-300 mt-auto">
                    Explore <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dresses;
