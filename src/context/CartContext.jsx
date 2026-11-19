import { createContext, useContext, useState, useEffect } from "react";
import { useAdmin } from "@/context/AdminContext";
const CartContext = createContext();

export function CartProvider({ children }) {
  const { products } = useAdmin();
  const [cart, setCart] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("saree_cart");
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      localStorage.removeItem("saree_cart");
    }
    return [];
  });
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [checkoutMode, setCheckoutMode] = useState("cart");

  useEffect(() => {
    // Persist cart to local storage
    if (typeof window !== "undefined") {
      localStorage.setItem("saree_cart", JSON.stringify(cart));
    }
  }, [cart]);

  useEffect(() => {
    if (!Array.isArray(products) || !products.length) return;
    setCart(current =>
      current.map(item => {
        const liveProduct = products.find(product => product.id === item.id);
        return liveProduct
          ? { ...liveProduct, quantity: Number(item.quantity) > 0 ? Number(item.quantity) : 1 }
          : item;
      })
    );
  }, [products]);

  const addToCart = (product, { openCart = true, quantity = 1 } = {}) => {
    const safeQuantity = Math.max(1, Number(quantity) || 1);
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, ...product, quantity: item.quantity + safeQuantity }
            : item
        );
      }
      return [...prev, { ...product, quantity: safeQuantity }];
    });
    
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

  const beginCheckout = (items, mode = "cart") => {
    setCheckoutItems(Array.isArray(items) ? items.map(item => ({ ...item })) : []);
    setCheckoutMode(mode);
  };

  const clearCheckout = () => {
    setCheckoutItems([]);
    setCheckoutMode("cart");
  };

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
        checkoutItems,
        checkoutMode,
        beginCheckout,
        clearCheckout,
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
