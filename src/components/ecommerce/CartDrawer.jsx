import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "@/data/products";
import { useCart } from "@/context/CartContext";

export function CartDrawer() {
  const navigate = useNavigate();
  const { isCartOpen, setIsCartOpen, cart, updateQuantity, removeFromCart, getCartTotal, beginCheckout } = useCart();

  const openCheckout = () => {
    if (!cart.length) return;
    beginCheckout(cart, "cart");
    setIsCartOpen(false);
    navigate("/checkout");
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full flex-col border-l border-border bg-background shadow-2xl sm:w-[400px]"
          >
            <div className="flex items-center justify-between border-b border-border bg-accent/5 p-6">
              <div className="flex items-center gap-3">
                <ShoppingBag className="text-gold-deep" size={24} />
                <h2 className="font-serif text-2xl text-primary">Your Cart</h2>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="rounded-full p-2 text-muted-foreground transition hover:bg-accent/10 hover:text-primary" aria-label="Close cart">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center opacity-70">
                  <ShoppingBag size={48} className="mb-4 text-muted-foreground" />
                  <p className="mb-2 font-serif text-xl text-primary">Your cart is empty</p>
                  <p className="text-sm text-muted-foreground">Looks like you haven't added any items yet.</p>
                  <button onClick={() => setIsCartOpen(false)} className="mt-6 rounded-full border border-gold px-6 py-2 text-xs uppercase tracking-wider text-gold-deep transition hover:bg-gold hover:text-white">
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {cart.map(item => (
                    <div key={item.id} className="flex gap-4 rounded-sm border border-border bg-card p-4">
                      <img src={item.image} alt={item.name} className="h-24 w-20 rounded-sm object-cover shadow-sm" />
                      <div className="flex flex-1 flex-col">
                        <h4 className="line-clamp-1 font-serif text-primary">{item.name}</h4>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground">{item.category}</p>
                        <div className="mt-auto flex items-center justify-between">
                          <span className="font-medium">{formatPrice(item.price)}</span>
                          <div className="flex items-center gap-3 rounded-full bg-accent/10 px-2 py-1">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-primary transition hover:text-gold" aria-label="Decrease quantity"><Minus size={14} /></button>
                            <span className="w-4 text-center text-sm">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-primary transition hover:text-gold" aria-label="Increase quantity"><Plus size={14} /></button>
                          </div>
                        </div>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="self-start p-1 text-muted-foreground transition hover:text-destructive" aria-label={`Remove ${item.name}`}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-border bg-accent/5 p-6">
                <div className="mb-6 flex items-center justify-between">
                  <span className="text-sm uppercase tracking-widest text-muted-foreground">Subtotal</span>
                  <span className="font-serif text-2xl text-primary">{formatPrice(getCartTotal())}</span>
                </div>
                <button onClick={openCheckout} className="flex w-full items-center justify-center gap-2 rounded-sm bg-primary py-4 text-sm font-semibold uppercase tracking-widest text-primary-foreground shadow-md transition hover:bg-gold">
                  Proceed to Checkout <ArrowRight size={16} />
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
