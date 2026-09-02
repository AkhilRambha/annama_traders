import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ShoppingBag, Eye, Star, MessageCircle, X } from "lucide-react";
import { formatPrice } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { whatsappOrder } from "@/lib/whatsapp";

export function ProductCard({ product, index, bgColor }) {
  const { addToCart } = useCart();
  const [showBuyNow, setShowBuyNow] = useState(false);
  const [buyForm, setBuyForm] = useState({ name: "", phone: "", email: "", address: "", quantity: 1 });
  const [buyErrors, setBuyErrors] = useState({});

  const handleBuyNow = (e) => {
    e.preventDefault();
    const errs = {};
    if (!buyForm.name.trim())    errs.name    = "Required";
    if (!buyForm.phone.trim())   errs.phone   = "Required";
    if (!buyForm.address.trim()) errs.address = "Required";
    if (Object.keys(errs).length) { setBuyErrors(errs); return; }
    
    whatsappOrder(product, buyForm);
    setShowBuyNow(false);
    setBuyForm({ name: "", phone: "", email: "", address: "", quantity: 1 });
    setBuyErrors({});
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay: (index % 4) * 0.1 }}
        className={`group relative flex flex-col ${bgColor || 'bg-background'} rounded-sm shadow-sm hover:shadow-luxe transition duration-500 overflow-hidden border border-border`}
      >
        {/* Image Section */}
        <div className="relative aspect-square overflow-hidden bg-accent/10">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-in-out"
            loading="lazy"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
              <span className="px-2 py-1 bg-gold text-white text-[10px] uppercase tracking-wider rounded-sm font-semibold shadow-sm">
                New
              </span>
            )}
            {product.isFeatured && (
              <span className="px-2 py-1 bg-primary text-white text-[10px] uppercase tracking-wider rounded-sm font-semibold shadow-sm">
                Featured
              </span>
            )}
          </div>

          {/* Hover Actions */}
          <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
            <button 
              onClick={() => setShowBuyNow(true)}
              className="w-12 h-12 rounded-full bg-white text-[#25D366] flex items-center justify-center shadow-lg hover:scale-110 hover:bg-[#25D366] hover:text-white transition"
              title="Buy Now via WhatsApp"
            >
              <MessageCircle size={20} />
            </button>
            <button 
              onClick={() => addToCart(product)}
              className="w-12 h-12 rounded-full bg-white text-primary flex items-center justify-center shadow-lg hover:scale-110 hover:bg-gold hover:text-white transition"
              title="Add to Cart"
            >
              <ShoppingBag size={20} />
            </button>
            <Link 
              to={`/product/${product.id}`}
              className="w-12 h-12 rounded-full bg-white text-primary flex items-center justify-center shadow-lg hover:scale-110 hover:bg-gold hover:text-white transition"
              title="Quick View"
            >
              <Eye size={20} />
            </Link>
          </div>
        </div>

        {/* Details Section */}
        <div className="p-3 md:p-5 flex flex-col flex-1">
          <div className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1 line-clamp-1">
            {product.category}
          </div>
          <h3 className="font-serif text-sm md:text-lg text-primary line-clamp-1 md:line-clamp-2 mb-2 group-hover:text-gold-deep transition-colors">
            {product.name}
          </h3>
          <div className="mt-auto flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0">
            <span className="text-primary font-medium text-xs md:text-base">{formatPrice(product.price)}</span>
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={10} className={`md:w-3 md:h-3 ${i < 4 ? "fill-gold text-gold" : "fill-gold/30 text-gold/30"}`} />
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Buy Now Modal */}
      <AnimatePresence>
        {showBuyNow && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowBuyNow(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-background rounded-sm shadow-2xl w-full max-w-md p-6 z-10 border border-border overflow-y-auto max-h-[90vh]"
            >
              <button onClick={() => setShowBuyNow(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-primary transition">
                <X size={20} />
              </button>
              <h3 className="font-serif text-2xl text-primary mb-1">Order via WhatsApp</h3>
              <p className="text-xs text-muted-foreground mb-4">
                <span className="font-medium text-primary">{product.name}</span> — {formatPrice(product.price)}
              </p>

              <form onSubmit={handleBuyNow} className="flex flex-col gap-3">
                {[
                  ["name", "Full Name *", "text", "Jane Doe"],
                  ["phone", "Phone Number *", "tel", "+91 98765 43210"],
                  ["email", "Email (optional)", "email", "jane@example.com"]
                ].map(([key, label, type, ph]) => (
                  <div key={key} className="space-y-1">
                    <label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</label>
                    <input 
                      type={type} 
                      value={buyForm[key]} 
                      placeholder={ph}
                      onChange={e => setBuyForm(p => ({ ...p, [key]: e.target.value }))}
                      className="w-full p-3 border border-border rounded-sm bg-background focus:outline-none focus:border-gold transition text-sm"
                    />
                    {buyErrors[key] && <p className="text-red-500 text-xs">{buyErrors[key]}</p>}
                  </div>
                ))}

                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-muted-foreground">Delivery Address *</label>
                  <textarea 
                    rows={3} 
                    value={buyForm.address}
                    onChange={e => setBuyForm(p => ({ ...p, address: e.target.value }))}
                    placeholder="Full address with pincode..."
                    className="w-full p-3 border border-border rounded-sm bg-background focus:outline-none focus:border-gold transition text-sm resize-none"
                  />
                  {buyErrors.address && <p className="text-red-500 text-xs">{buyErrors.address}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-muted-foreground">Quantity</label>
                  <input 
                    type="number" 
                    min={1} max={10} 
                    value={buyForm.quantity}
                    onChange={e => setBuyForm(p => ({ ...p, quantity: Number(e.target.value) }))}
                    className="w-full p-3 border border-border rounded-sm bg-background focus:outline-none focus:border-gold transition text-sm"
                  />
                </div>

                <div className="mt-2 p-3 bg-primary/5 rounded-sm border border-primary/20 text-xs text-muted-foreground">
                  Total: <span className="font-semibold text-primary">{formatPrice(product.price * buyForm.quantity)}</span>
                  <br />You'll be redirected to WhatsApp. Payment collected upon delivery confirmation.
                </div>

                <button 
                  type="submit"
                  className="mt-2 w-full flex items-center justify-center gap-2 py-4 bg-[#25D366] text-white font-semibold uppercase tracking-widest text-sm rounded-sm hover:bg-[#128C7E] transition shadow-md"
                >
                  <MessageCircle size={18} /> Continue to WhatsApp
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
