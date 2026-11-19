import { motion } from "framer-motion";
import { CreditCard, Eye, ShoppingBag, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { formatPrice } from "@/data/products";
import { useCart } from "@/context/CartContext";

export function ProductCard({ product, index, bgColor }) {
  const { addToCart, beginCheckout } = useCart();
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.1 }}
      className={`group relative flex flex-col ${bgColor || "bg-background"} overflow-hidden rounded-sm border border-border shadow-sm transition duration-500 hover:shadow-luxe`}
    >
      <div className="relative aspect-square overflow-hidden bg-accent/10">
        <img src={product.image} alt={product.name} className="h-full w-full object-cover transition duration-700 ease-in-out group-hover:scale-105" loading="lazy" />

        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {product.isNew && <span className="rounded-sm bg-gold px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white shadow-sm">New</span>}
          {product.isFeatured && <span className="rounded-sm bg-primary px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white shadow-sm">Featured</span>}
        </div>

        <div className="absolute inset-0 flex items-center justify-center gap-3 bg-primary/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <button
            type="button"
            onClick={() => {
              beginCheckout([{ ...product, quantity: 1 }], "buy");
              navigate("/checkout");
            }}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-primary shadow-lg transition hover:scale-110 hover:bg-gold hover:text-white"
            title="Buy Now"
          >
            <CreditCard size={20} />
          </button>
          <button type="button" onClick={() => addToCart(product)} className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-primary shadow-lg transition hover:scale-110 hover:bg-gold hover:text-white" title="Add to Cart">
            <ShoppingBag size={20} />
          </button>
          <Link to={`/product/${product.id}`} className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-primary shadow-lg transition hover:scale-110 hover:bg-gold hover:text-white" title="Quick View">
            <Eye size={20} />
          </Link>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-3 md:p-5">
        <div className="mb-1 line-clamp-1 text-[9px] uppercase tracking-[0.2em] text-muted-foreground md:text-[10px]">{product.category}</div>
        <h3 className="mb-2 line-clamp-1 font-serif text-sm text-primary transition-colors group-hover:text-gold-deep md:line-clamp-2 md:text-lg">{product.name}</h3>
        <div className="mt-auto flex flex-col justify-between gap-1 sm:flex-row sm:items-center sm:gap-0">
          <span className="text-xs font-medium text-primary md:text-base">{formatPrice(product.price)}</span>
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={10} className={`md:h-3 md:w-3 ${i < 4 ? "fill-gold text-gold" : "fill-gold/30 text-gold/30"}`} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
