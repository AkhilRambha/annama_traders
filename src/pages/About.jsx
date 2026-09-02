import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import shop from "@/assets/sarees/Shop.jfif";
import a1 from "@/assets/sarees/silk7.jfif";
import a2 from "@/assets/sarees/pt6.jfif";
import a3 from "@/assets/sarees/kalam2.jfif";

function AboutPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <div ref={containerRef} className="bg-background">
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          src={shop}
          alt="Shop"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/80 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/90 via-transparent to-background" />

        <div className="relative z-10 px-6 mt-20 max-w-5xl mx-auto flex flex-col items-center md:items-start justify-center w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-xs md:text-sm uppercase tracking-[0.5em] text-gold mb-6 md:mb-8"
          >
            — Our Story
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="font-serif text-4xl md:text-6xl lg:text-7xl leading-[1.1] text-white text-center md:text-left max-w-4xl"
          >
            Built on tea, <br />
            <em className="font-script text-gold not-italic text-5xl md:text-7xl lg:text-8xl pr-2 md:pr-4">trust,</em> and a trunk <br />
            full of sarees.
          </motion.h1>
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="max-w-3xl mx-auto px-6 lg:px-10 py-24 text-left">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
          className="space-y-8 font-serif text-xl md:text-2xl lg:text-3xl text-primary leading-snug"
        >
          <p>
            <span className="font-script text-gold text-5xl md:text-6xl lg:text-7xl float-left mr-2 leading-[0.8]">A</span>
            nnamma Traders began with a quiet observation — that buying a saree should feel like an heirloom moment, not a fluorescent-lit transaction.
          </p>
          <p className="text-muted-foreground text-lg md:text-xl italic font-light">
            So in 2020, we turned the model inside out. We pack a trunk. We come to you.
          </p>
          <p>
            Six years on, we've draped sarees across living rooms in Banjara Hills, Nagole, Kondapur and Jubilee Hills — for first-time buyers, second-time brides, and grandmothers who know more about pattu than we ever will.
          </p>
        </motion.div>
      </section>

      {/* THE JOURNEY */}
      <section className="bg-primary text-primary-foreground py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center font-serif text-3xl md:text-4xl lg:text-5xl mb-16"
          >
            The <em className="font-script text-gold not-italic">journey</em> so far
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border border-gold/30"
          >
            {[
              { year: "2020", title: "The first trunk", desc: "Started with 30 sarees and a Maruti boot." },
              { year: "2022", title: "Bridal arrives", desc: "Curated our first dedicated bridal Kanchi collection." },
              { year: "2024", title: "500 homes", desc: "Crossed 500 home appointments across Hyderabad." },
              { year: "2026", title: "The studio", desc: "Expanding into a by-appointment Nagole studio." }
            ].map((item, i) => (
              <div
                key={item.year}
                className={`p-6 lg:p-8 bg-black/10 ${i !== 0 ? 'border-t md:border-t-0 md:border-l border-gold/20' : ''}`}
              >
                <div className="font-script text-gold text-2xl md:text-3xl mb-3">{item.year}</div>
                <h3 className="font-serif text-lg md:text-xl text-white mb-2">{item.title}</h3>
                <p className="text-sm text-primary-foreground/70 font-light leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* EDITORIAL GALLERY */}
      <section className="py-20 lg:py-40 bg-accent/10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Gallery Grid */}
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4 items-end">
              <div className="aspect-[3/4] rounded-sm overflow-hidden shadow-luxe">
                <img src={a1} alt="Saree detail" className="w-full h-full object-cover" />
              </div>
              <div className="aspect-square rounded-sm overflow-hidden shadow-luxe">
                <img src={a2} alt="Saree detail" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="aspect-[4/3] rounded-sm overflow-hidden shadow-luxe">
              <img src={a3} alt="Saree detail" className="w-full h-full object-cover" />
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-[0.4em] text-gold mb-6">— WHAT WE BELIEVE</div>
            <h2 className="font-serif text-4xl md:text-5xl text-primary leading-tight mb-8">
              Slow shopping. <em className="font-script text-gold not-italic">Deeper joy.</em>
            </h2>
            <div className="space-y-8">
              {[
                { t: "Craft over catalogue", d: "Every saree is chosen for the weave, not the SKU count." },
                { t: "Presence over pressure", d: "We sit, we chat, we drape. The right saree announces itself." },
                { t: "Relationships over transactions", d: "Most of our patrons return to us to buy for their daughters." },
              ].map((v, i) => (
                <motion.div
                  key={v.t}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2, duration: 0.8 }}
                  className="pl-5 border-l border-gold/50"
                >
                  <div className="font-serif text-xl md:text-2xl text-primary mb-2">{v.t}</div>
                  <div className="text-muted-foreground text-sm md:text-base leading-relaxed">{v.d}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}

export default AboutPage;
