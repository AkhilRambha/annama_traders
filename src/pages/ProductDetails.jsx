import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { formatPrice } from "@/data/products";
import { useAdmin } from "@/context/AdminContext";
import { useCart } from "@/context/CartContext";
import { whatsappOrder } from "@/lib/whatsapp";
import { DRESS_CATEGORIES_META } from "@/data/dressProducts";
import { ArrowLeft, ShoppingBag, Truck, ShieldCheck, Heart, ChevronDown, ChevronUp, ChevronRight, Star, ArrowRight, MessageCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "@/components/ecommerce/ProductCard";

function ProductDetailsPage() {
  const { products: PRODUCTS } = useAdmin();
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, setIsCartOpen } = useCart();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [showBuyNow, setShowBuyNow] = useState(false);
  const [buyForm, setBuyForm] = useState({ name: "", phone: "", email: "", address: "", quantity: 1 });
  const [buyErrors, setBuyErrors] = useState({});
  
  // Determine if this is a dress product
  const isDress = product && Object.keys(DRESS_CATEGORIES_META).some(
    slug => product.category === DRESS_CATEGORIES_META[slug].name
  );
  const getDressSlug = (cat) => Object.keys(DRESS_CATEGORIES_META).find(
    slug => DRESS_CATEGORIES_META[slug].name === cat
  );
  
  // Accordion state
  const [openSection, setOpenSection] = useState("description");

  // Buy Now submit handler
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

  useEffect(() => {
    const found = PRODUCTS.find((p) => p.id === id);
    if (found) {
      setProduct(found);
      
      // Find related products in same category (excluding current)
      const related = PRODUCTS.filter(p => p.category === found.category && p.id !== id).slice(0, 4);
      // If not enough in category, just fill with others
      if (related.length < 4) {
        const others = PRODUCTS.filter(p => p.id !== id && !related.includes(p)).slice(0, 4 - related.length);
        setRelatedProducts([...related, ...others]);
      } else {
        setRelatedProducts(related);
      }
    } else {
      navigate("/collections");
    }
    window.scrollTo(0, 0);
  }, [id, navigate]);

  if (!product) return null;

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const categoryHref = isDress
    ? `/dresses/${getDressSlug(product.category)}`
    : `/collections?category=${encodeURIComponent(product.category)}`;

  return (
    <div className="min-h-screen pt-32 pb-24">
      {/* Breadcrumbs */}
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 mb-8">
        <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
          <Link to="/" className="hover:text-primary transition">Home</Link>
          <ChevronRight size={12} />
          <Link to={categoryHref} className="hover:text-primary transition">
            {product.category}
          </Link>
          <ChevronRight size={12} />
          <span className="text-primary font-medium truncate">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Left: Image Gallery (Reduced Size) */}
        <div className="lg:col-span-5 lg:sticky lg:top-32 flex justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative w-full max-w-md aspect-[3/4] md:aspect-square lg:aspect-[4/5] rounded-sm overflow-hidden bg-accent/5 group shadow-luxe"
          >
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
            />
            {product.isNew && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-gold text-white text-[10px] uppercase tracking-widest rounded-sm font-semibold shadow-md">
                New
              </span>
            )}
            <button className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-md rounded-full text-primary hover:text-gold hover:bg-white transition shadow-sm">
              <Heart size={18} />
            </button>
          </motion.div>
        </div>

        {/* Right: Product Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-7 flex flex-col pt-2"
        >
          <div className="flex items-center gap-4 mb-3">
            <Link 
              to={`/collections?category=${encodeURIComponent(product.category)}`}
              className="text-xs uppercase tracking-[0.3em] text-gold-deep hover:text-gold transition inline-block"
            >
              {product.category}
            </Link>
          </div>
          
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-primary leading-[1.2] mb-4">
            {product.name}
          </h1>

          {/* Reviews & Ratings */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className={i < 4 ? "fill-gold text-gold" : "fill-gold/30 text-gold/30"} />
              ))}
            </div>
            <span className="text-xs uppercase tracking-widest text-muted-foreground border-l border-border pl-3">
              24 Reviews
            </span>
          </div>
          
          <div className="text-2xl font-serif text-primary mb-4 pb-4 border-b border-border">
            {formatPrice(product.price)}
            <span className="text-xs font-sans text-muted-foreground ml-3 uppercase tracking-widest">Tax included</span>
          </div>

          {/* Stock Indicator */}
          <div className="mb-8 flex items-center gap-2">
            {product.stock > 0 || product.stock === undefined ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs uppercase tracking-widest font-semibold border border-green-200">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                In Stock {product.stock !== undefined ? `(${product.stock} left)` : ""}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs uppercase tracking-widest font-semibold border border-red-200">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                Out of Stock
              </span>
            )}
          </div>

          {/* Accordions */}
          <div className="border-t border-border border-b mb-10">
            {/* Description Accordion */}
            <div className="border-b border-border">
              <button 
                onClick={() => toggleSection("description")}
                className="flex items-center justify-between w-full py-5 text-left text-sm uppercase tracking-widest font-semibold text-primary hover:text-gold-deep transition"
              >
                Product Description
                {openSection === "description" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              <AnimatePresence>
                {openSection === "description" && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="pb-6 text-muted-foreground leading-relaxed text-sm">
                      {product.description}
                      <br/><br/>
                      Woven with exquisite precision, this beautiful piece from our {product.category} collection represents the pinnacle of traditional Indian craftsmanship. Every thread tells a story of heritage, making it perfect for your most cherished occasions. The rich texture and vibrant colors are designed to make you stand out while honoring our timeless weaving traditions.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Details Accordion */}
            <div className="border-b border-border">
              <button 
                onClick={() => toggleSection("details")}
                className="flex items-center justify-between w-full py-5 text-left text-sm uppercase tracking-widest font-semibold text-primary hover:text-gold-deep transition"
              >
                Fabric & Care
                {openSection === "details" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              <AnimatePresence>
                {openSection === "details" && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <ul className="pb-6 text-muted-foreground leading-relaxed list-disc list-inside space-y-2 text-sm">
                      <li><strong>Fabric:</strong> Premium Quality</li>
                      <li><strong>Weave:</strong> Hand-loomed traditional technique</li>
                      <li><strong>Wash Care:</strong> Dry clean only. Do not machine wash.</li>
                      <li><strong>Storage:</strong> Store in a cool, dry place. Wrap in cotton cloth to preserve the zari.</li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Delivery Accordion */}
            <div>
              <button 
                onClick={() => toggleSection("delivery")}
                className="flex items-center justify-between w-full py-5 text-left text-sm uppercase tracking-widest font-semibold text-primary hover:text-gold-deep transition"
              >
                Delivery & Returns
                {openSection === "delivery" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              <AnimatePresence>
                {openSection === "delivery" && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="pb-6 text-muted-foreground leading-relaxed text-sm">
                      We offer free home delivery across Hyderabad within 48 hours. You can review the saree at your doorstep before making the final payment. 
                      <br/><br/>
                      For returns, we accept exchanges within 7 days of purchase, provided the saree is unstitched, unworn, and retains its original folds and tags.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-10 w-full lg:w-[80%]">
            {/* Buy Now via WhatsApp */}
            <button
              disabled={product.stock === 0}
              onClick={() => setShowBuyNow(true)}
              className={`water-fill-btn flex-1 py-4 transition rounded-sm uppercase tracking-widest text-xs sm:text-sm font-bold shadow-luxe overflow-hidden relative border bg-background ${
                product.stock === 0 
                  ? "border-gray-200 text-gray-400 cursor-not-allowed opacity-50" 
                  : "border-[#25D366]/50 text-primary"
              }`}
            >
              <span className={`relative z-10 flex items-center justify-center gap-2 ${product.stock === 0 ? "text-gray-400" : "mix-blend-difference text-white"}`}>
                <MessageCircle size={16} /> Buy Now via WhatsApp
              </span>
            </button>
            <button
              disabled={product.stock === 0}
              onClick={() => addToCart(product, { showToast: true, openCart: true })}
              className={`flex-1 flex items-center justify-center gap-2 py-4 transition rounded-sm uppercase tracking-widest text-xs sm:text-sm font-semibold shadow-sm ${
                product.stock === 0 
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                  : "bg-primary text-primary-foreground hover:bg-gold"
              }`}
            >
              <ShoppingBag size={18} /> {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-4 bg-accent/5 p-4 rounded-sm border border-border">
              <Truck className="text-gold-deep shrink-0" size={24} />
              <div>
                <div className="font-serif text-primary text-sm">Free Home Delivery</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Within Hyderabad</div>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-accent/5 p-4 rounded-sm border border-border">
              <ShieldCheck className="text-gold-deep shrink-0" size={24} />
              <div>
                <div className="font-serif text-primary text-sm">Quality Assured</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Hand-picked sarees</div>
              </div>
            </div>
          </div>

        </motion.div>
      </div>

      {/* Suggestion / Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-10 mt-32 pt-20 border-t border-border bg-accent/5 -mx-6 lg:-mx-10 pb-20">
          <div className="max-w-screen-xl mx-auto">
            <div className="flex items-end justify-between mb-12 flex-wrap gap-6">
              <div>
                <div className="text-xs uppercase tracking-[0.4em] text-gold-deep mb-4">
                  — Similar Styles
                </div>
                <h2 className="font-serif text-4xl md:text-5xl text-primary">
                  You May Also <em className="font-script gold-text not-italic">Love</em>
                </h2>
              </div>
              <Link
                to={`/collections?category=${encodeURIComponent(product.category)}`}
                className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-primary border-b border-gold pb-1 hover:gap-3 transition-all"
              >
                View More <ArrowRight size={14} />
              </Link>
            </div>

            <div className="flex overflow-x-auto md:grid md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8 pb-6 hide-scrollbar snap-x snap-mandatory -mx-6 px-6 md:mx-0 md:px-0 mt-4">
              {relatedProducts.map((p, index) => (
                <div key={p.id} className="w-[160px] sm:w-[280px] md:w-auto flex-shrink-0 md:flex-shrink snap-start">
                  <ProductCard product={p} index={index} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Buy Now Modal ─────────────────────────────────── */}
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
              <button onClick={() => setShowBuyNow(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-primary">
                <X size={20} />
              </button>
              <h3 className="font-serif text-2xl text-primary mb-1">Order via WhatsApp</h3>
              <p className="text-xs text-muted-foreground mb-4">
                <span className="font-medium text-primary">{product.name}</span> — {formatPrice(product.price)}
              </p>
              <form onSubmit={handleBuyNow} className="flex flex-col gap-3">
                {[["name","Full Name *","text","Jane Doe"],["phone","Phone Number *","tel","+91 98765 43210"],["email","Email (optional)","email","jane@example.com"]].map(([key,label,type,ph]) => (
                  <div key={key} className="space-y-1">
                    <label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</label>
                    <input type={type} value={buyForm[key]} placeholder={ph}
                      onChange={e => setBuyForm(p => ({ ...p, [key]: e.target.value }))}
                      className="w-full p-3 border border-border rounded-sm bg-background focus:outline-none focus:border-gold transition text-sm"
                    />
                    {buyErrors[key] && <p className="text-red-500 text-xs">{buyErrors[key]}</p>}
                  </div>
                ))}
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-muted-foreground">Delivery Address *</label>
                  <textarea rows={3} value={buyForm.address}
                    onChange={e => setBuyForm(p => ({ ...p, address: e.target.value }))}
                    placeholder="Full address with pincode..."
                    className="w-full p-3 border border-border rounded-sm bg-background focus:outline-none focus:border-gold transition text-sm resize-none"
                  />
                  {buyErrors.address && <p className="text-red-500 text-xs">{buyErrors.address}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-muted-foreground">Quantity</label>
                  <input type="number" min={1} max={10} value={buyForm.quantity}
                    onChange={e => setBuyForm(p => ({ ...p, quantity: Number(e.target.value) }))}
                    className="w-full p-3 border border-border rounded-sm bg-background focus:outline-none focus:border-gold transition text-sm"
                  />
                </div>
                <div className="mt-2 p-3 bg-primary/5 rounded-sm border border-primary/20 text-xs text-muted-foreground">
                  Total: <span className="font-semibold text-primary">{formatPrice(product.price * buyForm.quantity)}</span>
                  <br />You'll be redirected to WhatsApp. Payment collected upon delivery confirmation.
                </div>
                <button type="submit"
                  className="mt-2 w-full flex items-center justify-center gap-2 py-4 bg-[#25D366] text-white font-semibold uppercase tracking-widest text-sm rounded-sm hover:bg-[#128C7E] transition"
                >
                  <MessageCircle size={18} /> Continue to WhatsApp
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ProductDetailsPage;
