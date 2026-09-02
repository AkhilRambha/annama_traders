import { motion } from "framer-motion";
import { useAdmin } from "@/context/AdminContext";

export default function PrivacyPolicy() {
  const { legalPages } = useAdmin();

  return (
    <div className="bg-background min-h-screen pt-36 pb-24 px-6 lg:px-10">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white p-10 md:p-16 lg:p-20 shadow-2xl shadow-black/5 border border-gold/20 relative"
        >
          {/* Decorative Corners */}
          <div className="absolute top-4 left-4 w-12 h-12 border-t border-l border-gold/40"></div>
          <div className="absolute top-4 right-4 w-12 h-12 border-t border-r border-gold/40"></div>
          <div className="absolute bottom-4 left-4 w-12 h-12 border-b border-l border-gold/40"></div>
          <div className="absolute bottom-4 right-4 w-12 h-12 border-b border-r border-gold/40"></div>

          <div className="text-xs uppercase tracking-[0.5em] text-gold-deep mb-4 text-center font-semibold">
            — Alankrita Legal —
          </div>
          <h1 className="font-serif text-4xl md:text-5xl text-primary mb-8 text-center">
            Privacy <em className="font-script gold-text not-italic">Policy</em>
          </h1>
          
          <div className="w-24 h-px bg-gold/30 mx-auto mb-12"></div>
          
          <div className="prose max-w-none text-gray-700 font-serif leading-loose whitespace-pre-wrap text-justify">
            {legalPages.privacy}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
