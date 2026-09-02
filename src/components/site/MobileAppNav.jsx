import { Link, useLocation } from "react-router-dom";
import { Home, Search, LayoutGrid, ShoppingBag, User, Star } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function MobileAppNav() {
  const location = useLocation();
  const { getCartCount, setIsCartOpen } = useCart();
  const cartCount = getCartCount();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: LayoutGrid, label: "Categories", path: "/collections" },
    { icon: Star, label: "Specials", path: "/specials" },
    { icon: ShoppingBag, label: "Cart", action: () => setIsCartOpen(true) },
    { icon: User, label: "Admin", path: "/admin" },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-t border-border z-50 px-6 py-3 pb-safe">
      <div className="flex items-center justify-between">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          if (item.action) {
            return (
              <button key={idx} onClick={item.action} className="flex flex-col items-center gap-1 text-muted-foreground relative">
                <Icon size={22} className="text-foreground" />
                <span className="text-[9px] uppercase tracking-wider font-medium text-foreground">
                  {item.label}
                </span>
                {item.label === "Cart" && cartCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-primary text-primary-foreground w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold">
                    {cartCount}
                  </span>
                )}
              </button>
            );
          }

          return (
            <Link key={idx} to={item.path} className={`flex flex-col items-center gap-1 transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`}>
              <Icon size={22} className={isActive ? "text-primary" : "text-foreground/70"} />
              <span className={`text-[9px] uppercase tracking-wider font-medium ${isActive ? "text-primary" : "text-foreground/70"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
