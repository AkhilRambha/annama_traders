import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, Home as HomeIcon, Calendar, Heart, ShoppingBag, Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

import { ProductCard } from "@/components/ecommerce/ProductCard";
import { useAdmin } from "@/context/AdminContext";

import traditional from "@/assets/sarees/pt3.jfif";
import bridal from "@/assets/sarees/pt5.jfif";
import silk from "@/assets/sarees/silk.jfif";
import designer from "@/assets/sarees/kalm3.jfif";
import shopBg from "@/assets/sarees/Shop.jfif";
import banner from "@/assets/sarees/banner.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

function HomePage() {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const { products, heroImages, categories: CATEGORIES, offers, heroStats, reviews } = useAdmin();
  const [currentReviewIdx, setCurrentReviewIdx] = useState(0);

  const nextReview = () => setCurrentReviewIdx((prev) => (prev + 1) % (reviews?.length || 1));
  const prevReview = () => setCurrentReviewIdx((prev) => (prev - 1 + (reviews?.length || 1)) % (reviews?.length || 1));

  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 4);
  const newArrivals = products.filter(p => p.isNew).slice(0, 4);

  const legacyImages = [traditional, heroImages[1] || shopBg, heroImages[2] || banner];
  const [legacyImgIdx, setLegacyImgIdx] = useState(0);

  const [heroImgIdx, setHeroImgIdx] = useState(0);

  useEffect(() => {
    const legacyInterval = setInterval(() => {
      setLegacyImgIdx((prev) => (prev + 1) % legacyImages.length);
    }, 4000);

    const heroInterval = setInterval(() => {
      setHeroImgIdx((prev) => (prev + 1) % heroImages.length);
    }, 3500);

    return () => {
      clearInterval(legacyInterval);
      clearInterval(heroInterval);
    };
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[100vh] flex items-center overflow-hidden pt-28">
        <motion.div style={{ scale }} className="absolute inset-0">
          <img src={banner} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-maroon-deep/85 via-primary/80 to-maroon-deep/90" />
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "radial-gradient(circle at 30% 40%, oklch(0.78 0.14 82 / 0.5), transparent 50%)",
            }}
          />
        </motion.div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-16 pb-24 grid lg:grid-cols-12 gap-12 items-center w-full z-10">
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.15 } } }}
            className="lg:col-span-6 text-primary-foreground"
          >
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-8">
              <span className="h-px w-12 bg-accent" />
              <span className="text-xs uppercase tracking-[0.4em] text-accent font-semibold">
                SINCE 2020 • HYDERABAD
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="font-serif text-4xl md:text-6xl xl:text-7xl leading-[1.05] text-balance mb-6"
            >
              The saree <br />
              showroom that <br />
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.8, type: "spring" }}
                className="font-script gold-text block mt-2 text-5xl md:text-7xl xl:text-8xl"
              >
                comes home.
              </motion.span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="max-w-xl text-lg text-primary-foreground/80 leading-relaxed font-serif italic mb-10"
            >
              Hand-picked pattu, soft silk, kalamkari and designer drapes — unfurled across your living room, chosen at your own pace, over a cup of chai.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-4 mb-16">
              <Link
                to="/contact"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-accent text-primary rounded-full text-xs uppercase tracking-[0.2em] shadow-luxe hover:bg-accent/90 transition font-bold"
              >
                BOOK HOME APPOINTMENT
                <ArrowRight size={16} className="group-hover:translate-x-1 transition" />
              </Link>
              <Link
                to="/collections"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-transparent border border-accent text-accent rounded-full text-xs uppercase tracking-[0.2em] shadow-luxe hover:bg-accent/10 transition font-bold"
              >
                VIEW COLLECTIONS
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-8 md:gap-16">
              <div>
                <div className="font-serif text-2xl md:text-3xl text-accent mb-1">{heroStats?.sareesCurated || "500+"}</div>
                <div className="text-[9px] uppercase tracking-[0.2em] text-primary-foreground/60 font-semibold">SAREES CURATED</div>
              </div>
              <div>
                <div className="font-serif text-2xl md:text-3xl text-accent mb-1 flex items-center gap-1">{heroStats?.avgExperience || "5"}★</div>
                <div className="text-[9px] uppercase tracking-[0.2em] text-primary-foreground/60 font-semibold">AVG. EXPERIENCE</div>
              </div>
              <div>
                <div className="font-serif text-2xl md:text-3xl text-accent mb-1">{heroStats?.showroomTrips || "0"}</div>
                <div className="text-[9px] uppercase tracking-[0.2em] text-primary-foreground/60 font-semibold">SHOWROOM TRIPS</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Dynamic Floating Image Stack */}
          <div className="hidden lg:block lg:col-span-6 relative h-[600px] perspective-1000">
            {heroImages.map((img, i) => {
              const pos = (i - heroImgIdx + heroImages.length) % heroImages.length;
              const isCenter = pos === 0;
              const isRight = pos === 1;

              return (
                <motion.div
                  key={i}
                  animate={{
                    x: isCenter ? "-50%" : isRight ? "20%" : "-120%",
                    y: isCenter ? 0 : isRight ? 40 : -40,
                    scale: isCenter ? 1 : 0.85,
                    rotate: isCenter ? 0 : isRight ? 6 : -6,
                    opacity: isCenter ? 1 : 0.6,
                    zIndex: isCenter ? 30 : 10,
                  }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="absolute top-12 left-1/2 w-64 h-[340px] rounded-sm overflow-hidden shadow-luxe border-4 border-gold border-solid origin-center"
                >
                  <div className={`absolute inset-0 bg-black/30 z-10 transition-opacity duration-1000 ${isCenter ? 'opacity-0' : 'opacity-100'}`} />
                  <img src={img} alt="Hero Saree" className="w-full h-full object-cover" />
                </motion.div>
              );
            })}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-accent/60 text-xs uppercase tracking-[0.4em] flex flex-col items-center gap-2"
        >
          Scroll to explore
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-px h-12 bg-accent/40"
          />
        </motion.div>
      </section>

      {/* MARQUEE STRIP */}
      <section className="py-6 gradient-royal text-primary-foreground border-y border-accent/30 overflow-hidden">
        <div className="flex gap-16 animate-[shimmer_30s_linear_infinite] whitespace-nowrap font-serif italic text-xl">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-16 shrink-0">
              {CATEGORIES.map((t, j) => (
                <span key={j} className={j % 2 === 0 ? "text-accent" : ""}>
                  {t} ✦
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* OUR STORY / HOW IT WORKS */}
      <section className="py-16 lg:py-20 max-w-7xl mx-auto px-6 lg:px-10 overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Images */}
          <div className="relative pl-6 lg:pl-8 w-11/12 md:w-4/5 lg:w-[85%] mx-auto lg:mx-0">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative rounded-sm overflow-hidden shadow-luxe"
            >
              <img src={traditional} alt="Our Story" className="w-full h-auto aspect-[3/4] object-cover" />

              <div className="absolute top-10 -left-6 lg:-left-12 pointer-events-none">
                <span className="font-script text-7xl lg:text-8xl text-gold/80 leading-none drop-shadow-md">est.<br />2020</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3 }}
              className="absolute -bottom-8 -right-4 lg:-right-8 w-2/3 max-w-[180px] lg:max-w-[200px] rounded-sm overflow-hidden border-[6px] border-background shadow-luxe z-10"
            >
              <img src={bridal} alt="Happy Bride" className="w-full h-auto aspect-square object-cover" />
            </motion.div>
          </div>

          {/* Content */}
          <div className="pt-16 lg:pt-0">
            <div className="text-xs uppercase tracking-[0.4em] text-gold-deep mb-6 flex items-center gap-4">
              <span className="w-6 h-px bg-gold-deep"></span> OUR STORY
            </div>

            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-primary mb-8 leading-[1.1]">
              Tradition, woven into <em className="font-script gold-text not-italic">every visit.</em>
            </h2>

            <p className="text-foreground/80 text-lg leading-relaxed mb-10">
              For six years, Alankrita (Annamma Traders) has been a quiet rebellion against crowded showrooms and fluorescent lights. We bring a hand-picked trunk of pattu, silk and designer sarees to your home — and stay until the right one finds you.
            </p>

            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-8">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full border border-gold flex items-center justify-center text-gold shrink-0">
                  <HomeIcon size={18} />
                </div>
                <div>
                  <h4 className="font-serif text-lg text-primary mb-1">Home doorstep</h4>
                  <p className="text-sm text-foreground/60 leading-relaxed">We come to you, anywhere in Hyderabad.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full border border-gold flex items-center justify-center text-gold shrink-0">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h4 className="font-serif text-lg text-primary mb-1">Hand-curated</h4>
                  <p className="text-sm text-foreground/60 leading-relaxed">Each saree vetted for craft and drape.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full border border-gold flex items-center justify-center text-gold shrink-0">
                  <Heart size={18} />
                </div>
                <div>
                  <h4 className="font-serif text-lg text-primary mb-1">Unhurried</h4>
                  <p className="text-sm text-foreground/60 leading-relaxed">Try as many as you like, judgement-free.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full border border-gold flex items-center justify-center text-gold shrink-0">
                  <ShoppingBag size={18} />
                </div>
                <div>
                  <h4 className="font-serif text-lg text-primary mb-1">Pay only for kept</h4>
                  <p className="text-sm text-foreground/60 leading-relaxed">No pressure, no obligation.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* FOUR STEPS SECTION */}
      <section className="relative py-16 lg:py-20 bg-[#5a0c10] overflow-hidden text-white">
        <div className="absolute inset-0 z-0">
          <img src={shopBg} alt="Background" className="w-full h-full object-cover opacity-20 mix-blend-multiply grayscale" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex flex-col items-center text-center mb-12 lg:mb-16">
            <Sparkles size={20} className="text-gold mb-6" />
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white">
              A showroom in four <em className="font-script gold-text not-italic block mt-2 lg:inline lg:mt-0">gentle steps.</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Step 1 */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ type: "spring", stiffness: 50, duration: 0.8, delay: 0.1 }}
              className="bg-white/5 backdrop-blur-md border border-gold/30 p-8 rounded-lg hover:border-gold/70 hover:bg-white/10 transition-all shadow-xl flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 rounded-full border border-gold/40 flex items-center justify-center mb-8 text-gold bg-black/20 group-hover:scale-110 transition-transform duration-500">
                <Calendar size={24} />
              </div>
              <h4 className="font-serif text-white text-2xl mb-4 flex items-center justify-center gap-3 w-full">
                 <span className="text-gold/60 text-base font-light font-sans tracking-widest">01</span> Book
              </h4>
              <p className="text-white/70 text-sm leading-relaxed">Tell us your date, occasion and style on WhatsApp.</p>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ type: "spring", stiffness: 50, duration: 0.8, delay: 0.2 }}
              className="bg-white/5 backdrop-blur-md border border-gold/30 p-8 rounded-lg hover:border-gold/70 hover:bg-white/10 transition-all shadow-xl flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 rounded-full border border-gold/40 flex items-center justify-center mb-8 text-gold bg-black/20 group-hover:scale-110 transition-transform duration-500">
                <HomeIcon size={24} />
              </div>
              <h4 className="font-serif text-white text-2xl mb-4 flex items-center justify-center gap-3 w-full">
                 <span className="text-gold/60 text-base font-light font-sans tracking-widest">02</span> We visit
              </h4>
              <p className="text-white/70 text-sm leading-relaxed">A curator arrives with a trunk of hand-picked sarees.</p>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ type: "spring", stiffness: 50, duration: 0.8, delay: 0.3 }}
              className="bg-white/5 backdrop-blur-md border border-gold/30 p-8 rounded-lg hover:border-gold/70 hover:bg-white/10 transition-all shadow-xl flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 rounded-full border border-gold/40 flex items-center justify-center mb-8 text-gold bg-black/20 group-hover:scale-110 transition-transform duration-500">
                <Heart size={24} />
              </div>
              <h4 className="font-serif text-white text-2xl mb-4 flex items-center justify-center gap-3 w-full">
                 <span className="text-gold/60 text-base font-light font-sans tracking-widest">03</span> Select
              </h4>
              <p className="text-white/70 text-sm leading-relaxed">Drape, try, photograph — take your time, no pressure.</p>
            </motion.div>

            {/* Step 4 */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ type: "spring", stiffness: 50, duration: 0.8, delay: 0.4 }}
              className="bg-white/5 backdrop-blur-md border border-gold/30 p-8 rounded-lg hover:border-gold/70 hover:bg-white/10 transition-all shadow-xl flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 rounded-full border border-gold/40 flex items-center justify-center mb-8 text-gold bg-black/20 group-hover:scale-110 transition-transform duration-500">
                <ShoppingBag size={24} />
              </div>
              <h4 className="font-serif text-white text-2xl mb-4 flex items-center justify-center gap-3 w-full">
                 <span className="text-gold/60 text-base font-light font-sans tracking-widest">04</span> Keep
              </h4>
              <p className="text-white/70 text-sm leading-relaxed">Pay only for the ones that came home to your wardrobe.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-28 bg-background">
        <div className="flex items-end justify-between mb-16 flex-wrap gap-6">
          <div>
            <div className="text-xs uppercase tracking-[0.4em] text-gold-deep mb-4">
              — Fresh from the Loom
            </div>
            <h2 className="font-serif text-5xl md:text-6xl text-primary max-w-2xl">
              New <em className="font-script gold-text not-italic">Arrivals.</em>
            </h2>
          </div>
          <Link
            to="/collections"
            className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-primary border-b border-gold pb-1 hover:gap-3 transition-all"
          >
            Shop All <ArrowRight size={14} />
          </Link>
        </div>

        <div className="flex overflow-x-auto lg:grid lg:grid-cols-4 gap-4 lg:gap-6 pb-6 hide-scrollbar snap-x snap-mandatory -mx-6 px-6 lg:mx-0 lg:px-0">
          {newArrivals.map((product, index) => (
            <div key={product.id} className="w-[160px] sm:w-[280px] lg:w-auto flex-shrink-0 lg:flex-shrink snap-start">
              <ProductCard product={product} index={index} />
            </div>
          ))}
        </div>
      </section>

      {/* EXQUISITE JEWELLERY */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-16 bg-background">
        <div className="flex items-end justify-between mb-16 flex-wrap gap-6">
          <div>
            <div className="text-xs uppercase tracking-[0.4em] text-gold-deep mb-4">
              — Timeless Adornments
            </div>
            <h2 className="font-serif text-5xl md:text-6xl text-primary max-w-2xl">
              Exquisite <em className="font-script gold-text not-italic">Jewellery.</em>
            </h2>
          </div>
          <Link
            to="/collections"
            className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-primary border-b border-gold pb-1 hover:gap-3 transition-all"
          >
            Explore Collection <ArrowRight size={14} />
          </Link>
        </div>

        <div className="flex overflow-x-auto lg:grid lg:grid-cols-4 gap-4 lg:gap-6 pb-6 hide-scrollbar snap-x snap-mandatory -mx-6 px-6 lg:mx-0 lg:px-0">
          {products.filter(p => p.category === "Jewellery").slice(0, 4).map((product, index) => (
            <div key={product.id} className="w-[160px] sm:w-[280px] lg:w-auto flex-shrink-0 lg:flex-shrink snap-start">
              <ProductCard product={product} index={index} />
            </div>
          ))}
        </div>
      </section>

      {/* COMBINED OFFERS SECTION */}
      {offers && offers.filter(o => o.isActive).length > 0 && (
        <section className="max-w-7xl mx-auto px-6 lg:px-10 py-16 bg-background">
          <div className="text-center mb-12">
            <div className="text-xs uppercase tracking-[0.4em] text-gold-deep mb-4">Limited Time</div>
            <h2 className="font-serif text-4xl md:text-5xl text-primary">Exclusive <em className="font-script gold-text not-italic">Offers</em></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {offers.filter(o => o.isActive).map((offer) => (
              <div key={offer.id} className="group relative overflow-hidden rounded-lg aspect-[16/9] md:aspect-[3/2] flex flex-col justify-end p-8 shadow-sm">
                <img src={offer.image} alt={offer.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                <div className="relative z-10 text-white">
                  <h3 className="font-serif text-2xl md:text-3xl mb-2 text-gold">{offer.title}</h3>
                  <p className="font-light text-sm md:text-base opacity-90 max-w-sm mb-6">{offer.description}</p>
                  <Link to="/collections" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary text-xs uppercase tracking-widest font-bold rounded-sm hover:bg-gold transition-colors">
                    Shop Now <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* UNIQUE CRAFT SECTION */}
      <section className="relative py-16 md:py-20 overflow-hidden bg-primary text-primary-foreground">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-12 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[300px] md:h-[450px] lg:aspect-[4/3] w-full overflow-hidden rounded-sm bg-maroon-deep"
          >
            {legacyImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt="Craftsmanship"
                className={`absolute inset-0 w-full h-full object-contain mix-blend-luminosity transition-opacity duration-1000 ${idx === legacyImgIdx ? "opacity-80" : "opacity-0"
                  }`}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-transparent to-transparent z-10" />
            <div className="absolute bottom-6 left-6 right-6 z-20">
              <div className="text-gold font-serif italic text-xl md:text-2xl mb-1">"Every thread tells a story of heritage."</div>
              <div className="text-[10px] md:text-xs uppercase tracking-widest text-primary-foreground/70">— Master Weavers</div>
            </div>

            {/* Carousel Indicators */}
            <div className="absolute top-4 right-4 flex gap-2 z-20">
              {legacyImages.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1 rounded-full transition-all duration-500 ${idx === legacyImgIdx ? 'w-6 bg-gold' : 'w-2 bg-white/30'}`}
                />
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="text-xs uppercase tracking-[0.4em] text-gold mb-6">Our Legacy</div>
            <h2 className="font-serif text-4xl md:text-6xl mb-8 leading-[1.1]">Preserving the <em className="font-script text-gold not-italic">authentic art</em> of Indian weaving.</h2>
            <p className="text-primary-foreground/70 leading-relaxed mb-8 text-lg">
              For over three generations, Alankrita has collaborated directly with master artisans across India. We believe in ethical sourcing, sustaining traditional handloom techniques, and bringing you sarees that aren't just garments, but heirloom pieces of art.
            </p>
            <Link to="/about" className="inline-flex items-center gap-3 px-8 py-4 border border-gold text-gold hover:bg-gold hover:text-primary transition uppercase tracking-widest text-sm font-semibold rounded-sm">
              Discover Our Story
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FEATURED SAREES */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-28 bg-accent/5">
        <div className="flex items-end justify-between mb-16 flex-wrap gap-6">
          <div>
            <div className="text-xs uppercase tracking-[0.4em] text-gold-deep mb-4">
              — Editor's Pick
            </div>
            <h2 className="font-serif text-5xl md:text-6xl text-primary max-w-2xl">
              Featured <em className="font-script gold-text not-italic">Masterpieces.</em>
            </h2>
          </div>
        </div>



        <div className="flex overflow-x-auto lg:grid lg:grid-cols-4 gap-4 lg:gap-6 pb-6 hide-scrollbar snap-x snap-mandatory -mx-6 px-6 lg:mx-0 lg:px-0 mt-10">
          {featuredProducts.map((product, index) => (
            <div key={product.id} className="w-[160px] sm:w-[280px] lg:w-auto flex-shrink-0 lg:flex-shrink snap-start">
              <ProductCard product={product} index={index} />
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 lg:py-28 bg-maroon-deep text-primary-foreground overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full bg-black/10 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 lg:px-10 relative z-10">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="w-8 md:w-12 h-px bg-gold"></span>
              <span className="text-xs uppercase tracking-[0.4em] text-gold">Words of Love</span>
              <span className="w-8 md:w-12 h-px bg-gold"></span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl">Our <em className="font-script text-gold not-italic">Brides & Patrons</em></h2>
          </div>

          {reviews && reviews.length > 0 && (
            <div className="relative">
              <motion.div 
                key={currentReviewIdx}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="bg-white/5 border border-white/10 p-6 lg:p-8 rounded-2xl backdrop-blur-sm shadow-2xl flex flex-col items-center text-center mx-auto"
              >
                <Quote className="w-10 h-10 text-gold/20 mb-4" />
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: reviews[currentReviewIdx].rating || 5 }).map((_, s) => <Star key={s} size={14} className="fill-gold text-gold" />)}
                </div>
                <p className="font-serif text-base lg:text-lg leading-relaxed text-white/90 italic mb-6">"{reviews[currentReviewIdx].content}"</p>
                <div className="mt-auto border-t border-white/10 pt-4 w-full">
                  <div className="text-sm font-semibold tracking-widest uppercase text-gold">{reviews[currentReviewIdx].name}</div>
                  <div className="text-[10px] text-white/50 tracking-[0.2em] uppercase mt-1">{reviews[currentReviewIdx].location}</div>
                </div>
              </motion.div>

              {/* Carousel Controls */}
              <div className="flex justify-center gap-4 mt-8">
                <button onClick={prevReview} className="p-3 rounded-full border border-gold/30 text-gold hover:bg-gold hover:text-maroon-deep transition-colors">
                  <ChevronLeft size={20} />
                </button>
                <button onClick={nextReview} className="p-3 rounded-full border border-gold/30 text-gold hover:bg-gold hover:text-maroon-deep transition-colors">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 lg:px-10 py-28 text-center border-t border-border">
        <h2 className="font-serif text-5xl md:text-6xl text-primary leading-tight">
          Your next saree is waiting <em className="font-script gold-text not-italic">at home.</em>
        </h2>
        <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
          Explore our collection and order online, or book a home trial.
        </p>
        <Link
          to="/collections"
          className="mt-10 inline-flex items-center gap-3 px-10 py-5 gradient-royal text-primary-foreground rounded-full text-sm uppercase tracking-[0.25em] shadow-luxe hover:scale-105 transition"
        >
          View All Collections <ArrowRight size={16} />
        </Link>
      </section>
    </>
  );
}

export default HomePage;
