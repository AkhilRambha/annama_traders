import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { formatPrice } from "@/data/products";
import { useAdmin } from "@/context/AdminContext";
import { useCart } from "@/context/CartContext";
import { DRESS_CATEGORIES_META } from "@/data/dressProducts";
import { ShoppingBag, Truck, Heart, ChevronDown, ChevronUp, ChevronRight, Star, ArrowRight, ZoomIn, Minus, Plus, Gem, Sparkles, Gift, LockKeyhole, BadgeCheck, RotateCcw, Headphones } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "@/components/ecommerce/ProductCard";

function ProductDetailsPage() {
  const { products: PRODUCTS } = useAdmin();
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, beginCheckout } = useCart();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [zoomLevel, setZoomLevel] = useState(2);
  const [zoomActive, setZoomActive] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState("50% 50%");
  const [detailQuantity, setDetailQuantity] = useState(1);
  const [pincode, setPincode] = useState("");
  const [deliveryMessage, setDeliveryMessage] = useState("");
  
  // Determine if this is a dress product
  const isDress = product && Object.keys(DRESS_CATEGORIES_META).some(
    slug => product.category === DRESS_CATEGORIES_META[slug].name
  );
  const getDressSlug = (cat) => Object.keys(DRESS_CATEGORIES_META).find(
    slug => DRESS_CATEGORIES_META[slug].name === cat
  );
  
  // Accordion state
  const [openSection, setOpenSection] = useState("description");


  useEffect(() => {
    const found = PRODUCTS.find((p) => p.id === id);
    if (found) {
      setProduct(found);
      setSelectedImage(found.image || "");
      setZoomLevel(2);
      setDetailQuantity(1);
      
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
  }, [id, navigate, PRODUCTS]);

  if (!product) return null;

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const categoryHref = isDress
    ? `/dresses/${getDressSlug(product.category)}`
    : `/collections?category=${encodeURIComponent(product.category)}`;

  const galleryImages = [...new Set([
    product.image,
    ...(Array.isArray(product.images) ? product.images : [])
  ].filter(Boolean))];
  const currentImage = selectedImage || product.image;
  const fabricValue = Array.isArray(product.fabric) ? product.fabric.join(", ") : (product.fabric || "Premium quality");
  const weaveValue = product.weave || "Traditional handloom weave";
  const washCareValue = product.washCare || "Dry clean only";
  const blouseValue = product.blouseDetails || "Blouse piece details available on request";
  const deliveryEstimate = product.deliveryEstimate || "48 hours";
  const deliveryInfo = product.deliveryInfo || "Free home delivery within Hyderabad";
  const returnPolicy = product.returnPolicy || "Exchange within 7 days for unworn, unstitched items";
  const isInStock = product.stock !== 0 && product.availability !== false && product.isAvailable !== false;

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

      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left: Image Gallery */}
        <div className="lg:col-span-6 lg:sticky lg:top-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex gap-3"
          >
            {galleryImages.length > 1 && (
              <div className="hidden w-16 shrink-0 flex-col gap-3 sm:flex">
                {galleryImages.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setSelectedImage(image)}
                    className={`aspect-[3/4] overflow-hidden rounded-sm border transition ${currentImage === image ? "border-gold shadow-md" : "border-border opacity-70 hover:opacity-100"}`}
                    aria-label={`View product image ${index + 1}`}
                  >
                    <img src={image} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="relative min-w-0 flex-1">
              <div
                className="relative block aspect-square w-full overflow-hidden rounded-sm bg-accent/5"
                onMouseEnter={() => setZoomActive(true)}
                onMouseLeave={() => setZoomActive(false)}
                onMouseMove={event => {
                  const bounds = event.currentTarget.getBoundingClientRect();
                  const x = ((event.clientX - bounds.left) / bounds.width) * 100;
                  const y = ((event.clientY - bounds.top) / bounds.height) * 100;
                  setZoomOrigin(`${x}% ${y}%`);
                }}
                onWheel={event => {
                  setZoomLevel(current => Math.min(3, Math.max(1.25, current + (event.deltaY < 0 ? 0.25 : -0.25))));
                  setZoomActive(true);
                }}
              >
                <img
                  src={currentImage}
                  alt={product.name}
                  style={{
                    transform: `scale(${zoomActive ? zoomLevel : 1})`,
                    transformOrigin: zoomOrigin,
                  }}
                  className="h-full w-full cursor-crosshair object-cover transition-transform duration-150"
                />
                {product.isNew && (
                  <span className="absolute top-4 left-4 px-3 py-1 bg-gold text-white text-[10px] uppercase tracking-widest rounded-sm font-semibold shadow-md">
                    New
                  </span>
                )}
                <button
                  type="button"
                  onClick={event => {
                    event.stopPropagation();
                    setZoomActive(current => !current);
                  }}
                  className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-xs text-primary shadow-sm"
                  aria-label={zoomActive ? "Turn zoom off" : "Turn zoom on"}
                >
                  <ZoomIn size={15} /> Zoom
                </button>
              </div>
              <button type="button" className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-md rounded-full text-primary hover:text-gold hover:bg-white transition shadow-sm" aria-label="Add to favorites">
                <Heart size={18} />
              </button>
            </div>
          </motion.div>

          {galleryImages.length > 1 && (
            <div className="mt-3 flex gap-3 sm:hidden">
              {galleryImages.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setSelectedImage(image)}
                  className={`h-20 w-16 overflow-hidden rounded-sm border ${currentImage === image ? "border-gold" : "border-border"}`}
                  aria-label={`View product image ${index + 1}`}
                >
                  <img src={image} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="mt-6 grid grid-cols-2 gap-3 border border-border bg-background p-3 sm:grid-cols-4 sm:p-4">
            {[
              [BadgeCheck, "100% Authentic", "Products"],
              [Truck, "Secure", "Shipping"],
              [RotateCcw, "Easy", "Returns"],
              [Headphones, "Dedicated", "Support"],
            ].map(([Icon, title, subtitle]) => (
              <div key={title} className="flex flex-col items-center gap-2 text-center">
                <Icon size={22} className="text-gold-deep" />
                <div>
                  <div className="text-xs font-semibold text-primary">{title}</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{subtitle}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Product Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-6 flex flex-col pt-1"
        >
          <div className="flex items-center gap-4 mb-3">
            <Link 
              to={`/collections?category=${encodeURIComponent(product.category)}`}
              className="text-xs uppercase tracking-[0.3em] text-gold-deep hover:text-gold transition inline-block"
            >
              {product.category}
            </Link>
          </div>
          
          <h1 className="font-serif text-3xl md:text-4xl lg:text-[44px] text-primary leading-[1.15] mb-4">
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
          <div className="mb-5 flex items-center gap-2">
            {isInStock ? (
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

          {/* Feature highlights */}
          <div className="mb-5 grid grid-cols-3 overflow-hidden rounded-sm border border-border">
            {[
              [Gem, "Authentic", "Polki Craft"],
              [Sparkles, "Premium", "Finish"],
              [Gift, "Elegant", "Gift Packaging"],
            ].map(([Icon, title, subtitle]) => (
              <div key={title} className="flex items-center justify-center gap-2 border-r border-border px-2 py-3 last:border-r-0">
                <Icon size={24} className="shrink-0 text-gold-deep" />
                <div>
                  <div className="text-xs text-primary">{title}</div>
                  <div className="text-[10px] text-muted-foreground">{subtitle}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Accordions */}
          <div className="border-t border-border border-b mb-6">
            {/* Description Accordion */}
            <div className="border-b border-border">
              <button 
                onClick={() => toggleSection("description")}
                className="flex items-center justify-between w-full py-4 text-left text-sm uppercase tracking-widest font-semibold text-primary hover:text-gold-deep transition"
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
                      {product.fabric && <><strong>Fabric:</strong> {fabricValue}. </>}
                      {product.color && <><strong>Color:</strong> {Array.isArray(product.color) ? product.color.join(", ") : product.color}. </>}
                      {product.occasion && <><strong>Occasion:</strong> {Array.isArray(product.occasion) ? product.occasion.join(", ") : product.occasion}. </>}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Details Accordion */}
            <div className="border-b border-border">
              <button 
                onClick={() => toggleSection("details")}
                className="flex items-center justify-between w-full py-4 text-left text-sm uppercase tracking-widest font-semibold text-primary hover:text-gold-deep transition"
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
                      <li><strong>Fabric:</strong> {fabricValue}</li>
                      <li><strong>Weave:</strong> {weaveValue}</li>
                      <li><strong>Wash Care:</strong> {washCareValue}</li>
                      <li><strong>Blouse Details:</strong> {blouseValue}</li>
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
                className="flex items-center justify-between w-full py-4 text-left text-sm uppercase tracking-widest font-semibold text-primary hover:text-gold-deep transition"
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
                      {deliveryInfo}. Estimated delivery: {deliveryEstimate}.
                      <br/><br/>
                      {returnPolicy}.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="mb-5">
            <label htmlFor="delivery-pincode" className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">
              Check delivery estimate
            </label>
            <div className="flex max-w-md gap-2">
              <input
                id="delivery-pincode"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={pincode}
                onChange={event => {
                  setPincode(event.target.value.replace(/\D/g, "").slice(0, 6));
                  setDeliveryMessage("");
                }}
                placeholder="Enter 6-digit pincode"
                className="min-w-0 flex-1 rounded-sm border border-border px-3 py-3 text-sm outline-none focus:border-gold"
              />
              <button
                type="button"
                onClick={() => {
                  if (pincode.length !== 6) setDeliveryMessage("Enter a valid 6-digit pincode.");
                  else setDeliveryMessage(`Estimated delivery: ${deliveryEstimate}`);
                }}
                className="rounded-sm border border-gold px-4 py-3 text-xs font-semibold uppercase tracking-widest text-primary hover:bg-gold hover:text-white"
              >
                Check
              </button>
            </div>
            {deliveryMessage && <p className="mt-2 text-sm text-muted-foreground">{deliveryMessage}</p>}
          </div>

          <div className="mb-6 flex items-center justify-between py-1">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Quantity</span>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setDetailQuantity(current => Math.max(1, current - 1))} className="flex h-9 w-9 items-center justify-center rounded-sm border border-border hover:border-gold" aria-label="Decrease quantity">
                <Minus size={14} />
              </button>
              <span className="w-6 text-center font-medium">{detailQuantity}</span>
              <button type="button" onClick={() => setDetailQuantity(current => current + 1)} className="flex h-9 w-9 items-center justify-center rounded-sm border border-border hover:border-gold" aria-label="Increase quantity">
                <Plus size={14} />
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8 w-full">
            {/* Buy Now */}
            <button
              disabled={!isInStock}
              onClick={() => {
                beginCheckout([{ ...product, quantity: detailQuantity }], "buy");
                navigate("/checkout");
              }}
              className={`water-fill-btn flex-1 py-4 transition rounded-sm uppercase tracking-widest text-xs sm:text-sm font-bold shadow-luxe overflow-hidden relative border bg-background ${
                !isInStock
                  ? "border-gray-200 text-gray-400 cursor-not-allowed opacity-50" 
                  : "border-[#25D366]/50 text-primary"
              }`}
            >
              <span className={`relative z-10 flex items-center justify-center gap-2 ${!isInStock ? "text-gray-400" : "mix-blend-difference text-white"}`}>
                <LockKeyhole size={16} /> Buy Now Securely
              </span>
            </button>
            <button
              disabled={!isInStock}
              onClick={() => addToCart(product, { openCart: true, quantity: detailQuantity })}
              className={`flex-1 flex items-center justify-center gap-2 py-4 transition rounded-sm uppercase tracking-widest text-xs sm:text-sm font-semibold shadow-sm ${
                !isInStock
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                  : "bg-primary text-primary-foreground hover:bg-gold"
              }`}
            >
              <ShoppingBag size={18} /> {!isInStock ? "Out of Stock" : "Add to Cart"}
            </button>
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

      {isInStock && (
        <div className="fixed bottom-0 inset-x-0 z-40 border-t border-border bg-background/95 px-4 py-3 shadow-[0_-10px_30px_rgba(0,0,0,0.08)] backdrop-blur-md lg:hidden">
          <div className="mx-auto flex max-w-screen-xl items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs uppercase tracking-wider text-muted-foreground">{product.name}</p>
              <p className="font-serif text-lg text-primary">{formatPrice(product.price * detailQuantity)}</p>
            </div>
            <button
              type="button"
              onClick={() => addToCart(product, { openCart: true, quantity: detailQuantity })}
              className="flex items-center gap-2 rounded-sm bg-primary px-5 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground"
            >
              <ShoppingBag size={16} /> Add
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default ProductDetailsPage;
