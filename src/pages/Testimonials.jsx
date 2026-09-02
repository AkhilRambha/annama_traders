import { motion } from "framer-motion";
import { Star, Play, Quote } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import reviewsHeroBg from "@/assets/hero/reviews_hero_bg.jpg";

function TestimonialsPage() {
  const { reviews } = useAdmin();

  return (
    <div className="bg-[#FAF9F6] min-h-screen text-[#1A1A1A] relative">
      <div className="absolute top-0 left-0 right-0 h-[70vh] bg-cover bg-center pointer-events-none" style={{ backgroundImage: `url(${reviewsHeroBg})` }} />
      <div className="absolute top-0 left-0 right-0 h-[70vh] bg-[#72242C]/80 pointer-events-none" />
      <div className="relative z-10 pt-36 pb-24 px-6 lg:px-10 max-w-screen-xl mx-auto">
        
        <div className="text-center max-w-3xl mx-auto mb-20 relative text-white">
          <Quote className="absolute top-0 left-1/2 -translate-x-1/2 text-gold/30 w-32 h-32 -mt-10 -z-10" />
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-xs uppercase tracking-[0.4em] text-gold mb-6 font-semibold"
          >
            — Words of Love
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl leading-none mb-8"
          >
            Our Happy <em className="font-script gold-text not-italic text-6xl md:text-8xl lg:text-9xl">Patrons</em>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-cream text-lg font-serif italic"
          >
            See what our brides and customers have to say about their Alankrita experience. 
            Real reviews, real smiles.
          </motion.p>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {reviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: (i % 3) * 0.15 }}
              className="break-inside-avoid bg-white border border-gray-200 shadow-sm hover:shadow-lg hover:border-gold/40 transition duration-500 rounded-sm overflow-hidden flex flex-col group"
            >
              {/* Visual Content (Video/Photo) */}
              {(review.type === "video" || review.type === "photo") && (
                <div className="relative overflow-hidden">
                  <img 
                    src={review.thumbnail} 
                    alt="Customer" 
                    className="w-full object-cover max-h-[400px] group-hover:scale-105 transition duration-700" 
                  />
                  <div className="absolute inset-0 bg-[#1A1A1A]/10 group-hover:bg-transparent transition duration-500" />
                  
                  {review.type === "video" && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition">
                      <div className="w-16 h-16 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 group-hover:scale-110 transition cursor-pointer shadow-lg">
                        <Play className="text-white fill-white ml-1" size={24} />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Review Content */}
              <div className="p-8 flex-1 flex flex-col relative">
                {review.type === "text" && (
                  <Quote className="absolute top-6 right-6 text-gold/10" size={64} />
                )}
                
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, index) => (
                    <Star 
                      key={index} 
                      size={14} 
                      className={index < review.rating ? "fill-gold text-gold" : "fill-gray-200 text-gray-200"} 
                    />
                  ))}
                </div>
                
                <p className="text-gray-800 font-serif italic text-xl leading-relaxed mb-8">
                  "{review.content}"
                </p>
                
                <div className="mt-auto pt-6 border-t border-gray-100">
                  <h4 className="font-bold text-[#1A1A1A] text-sm uppercase tracking-widest">{review.name}</h4>
                  <p className="text-xs text-gray-500 mt-2 uppercase tracking-widest">{review.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA section inside testimonials */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-32 text-center max-w-2xl mx-auto border-t border-gray-200 pt-16"
        >
          <h2 className="font-serif text-3xl md:text-4xl text-[#1A1A1A] mb-6">Experience Alankrita</h2>
          <p className="text-gray-600 mb-8 font-light">
            Become a part of our story. We'd love to help you find your perfect heirloom drape.
          </p>
          <a href="#/contact" className="inline-block px-10 py-4 bg-[#1A1A1A] text-white uppercase tracking-widest text-xs hover:bg-gold transition-colors duration-500 rounded-sm">
            Book an Appointment
          </a>
        </motion.div>

      </div>
    </div>
  );
}

export default TestimonialsPage;
