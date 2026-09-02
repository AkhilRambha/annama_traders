import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    // Load from local storage on initial render
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("saree_cart");
      if (saved) return JSON.parse(saved);
    }
    return [];
  });
  
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    // Persist cart to local storage
    if (typeof window !== "undefined") {
      localStorage.setItem("saree_cart", JSON.stringify(cart));
    }
  }, [cart]);

  const addToCart = (product, { showToast = true, openCart = true } = {}) => {
    let isExisting = false;
    
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        isExisting = true;
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    
    if (showToast) {
      // Need a small timeout to ensure state setter finishes before we evaluate isExisting,
      // actually since setCart is synchronous in terms of the function closure, we can just check if product is in cart state.
      // Wait, isExisting is modified inside the pure function which might be double invoked, but since it's just a boolean it's fine.
      // A better way is to just check the current state `cart` before calling setCart.
      const existing = cart.find((item) => item.id === product.id);
      if (existing) {
        toast.success(`Increased quantity of ${product.name} in cart`);
      } else {
        toast.success(`Added ${product.name} to cart`);
      }
    }
    
    if (openCart) {
      setIsCartOpen(true);
    }
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
