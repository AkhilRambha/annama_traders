import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/products";
import { whatsappCart } from "@/lib/whatsapp";

export function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cart, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const handleCheckout = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (!customerDetails.name || !customerDetails.phone || !customerDetails.address) return;

    whatsappCart(cart, customerDetails);

    // Clear cart and reset UI
    clearCart();
    setIsCartOpen(false);
    setIsCheckingOut(false);
    setCustomerDetails({ name: "", phone: "", address: "" });
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full sm:w-[400px] bg-background shadow-2xl z-50 flex flex-col border-l border-border"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border bg-accent/5">
              <div className="flex items-center gap-3">
                <ShoppingBag className="text-gold-deep" size={24} />
                <h2 className="font-serif text-2xl text-primary">Your Cart</h2>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-accent/10 rounded-full transition text-muted-foreground hover:text-primary"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-70">
                  <ShoppingBag size={48} className="mb-4 text-muted-foreground" />
                  <p className="font-serif text-xl text-primary mb-2">Your cart is empty</p>
                  <p className="text-sm text-muted-foreground">Looks like you haven't added any sarees yet.</p>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="mt-6 px-6 py-2 border border-gold text-gold-deep hover:bg-gold hover:text-white transition rounded-full uppercase text-xs tracking-wider"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {!isCheckingOut ? (
                    <div className="flex flex-col gap-6">
                      {cart.map((item) => (
                        <div key={item.id} className="flex gap-4 p-4 border border-border rounded-sm bg-card">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-20 h-24 object-cover rounded-sm shadow-sm"
                          />
                          <div className="flex-1 flex flex-col">
                            <h4 className="font-serif text-primary line-clamp-1">{item.name}</h4>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">{item.category}</p>
                            <div className="mt-auto flex items-center justify-between">
                              <span className="font-medium">{formatPrice(item.price)}</span>
                              
                              <div className="flex items-center gap-3 bg-accent/10 px-2 py-1 rounded-full">
                                <button 
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="text-primary hover:text-gold transition"
                                >
                                  <Minus size={14} />
                                </button>
                                <span className="text-sm w-4 text-center">{item.quantity}</span>
                                <button 
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="text-primary hover:text-gold transition"
                                >
                                  <Plus size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-muted-foreground hover:text-destructive self-start p-1 transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <motion.form 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      onSubmit={handleCheckout}
                      className="flex flex-col gap-4"
                    >
                      <h3 className="font-serif text-lg text-primary border-b border-border pb-2 mb-2">Delivery Details</h3>
                      
                      <div className="space-y-1">
                        <label className="text-xs uppercase tracking-wider text-muted-foreground">Full Name</label>
                        <input 
                          required
                          type="text" 
                          value={customerDetails.name}
                          onChange={e => setCustomerDetails(prev => ({...prev, name: e.target.value}))}
                          className="w-full p-3 border border-border rounded-sm bg-background focus:outline-none focus:border-gold transition"
                          placeholder="Jane Doe"
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-xs uppercase tracking-wider text-muted-foreground">Phone Number</label>
                        <input 
                          required
                          type="tel" 
                          value={customerDetails.phone}
                          onChange={e => setCustomerDetails(prev => ({...prev, phone: e.target.value}))}
                          className="w-full p-3 border border-border rounded-sm bg-background focus:outline-none focus:border-gold transition"
                          placeholder="+91 9876543210"
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-xs uppercase tracking-wider text-muted-foreground">Delivery Address</label>
                        <textarea 
                          required
                          rows="3"
                          value={customerDetails.address}
                          onChange={e => setCustomerDetails(prev => ({...prev, address: e.target.value}))}
                          className="w-full p-3 border border-border rounded-sm bg-background focus:outline-none focus:border-gold transition resize-none"
                          placeholder="Complete address with pincode..."
                        />
                      </div>

                      <button 
                        type="button"
                        onClick={() => setIsCheckingOut(false)}
                        className="mt-4 text-sm text-muted-foreground hover:text-primary transition underline"
                      >
                        Back to Cart
                      </button>
                    </motion.form>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-6 bg-accent/5 border-t border-border">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-muted-foreground uppercase tracking-widest text-sm">Subtotal</span>
                  <span className="font-serif text-2xl text-primary">{formatPrice(getCartTotal())}</span>
                </div>
                
                {!isCheckingOut ? (
                  <button 
                    onClick={() => setIsCheckingOut(true)}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-primary-foreground hover:bg-gold transition rounded-sm uppercase tracking-widest text-sm font-semibold shadow-md"
                  >
                    Proceed to Checkout <ArrowRight size={16} />
                  </button>
                ) : (
                  <button 
                    onClick={handleCheckout}
                    disabled={!customerDetails.name || !customerDetails.phone || !customerDetails.address}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-[#25D366] text-white hover:bg-[#128C7E] transition rounded-sm uppercase tracking-widest text-sm font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Place Order via WhatsApp
                  </button>
                )}
                <p className="text-center text-[10px] text-muted-foreground mt-4 uppercase tracking-wider">
                  Payment will be collected upon delivery
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
