import { Link, useLocation } from "react-router-dom";
import { Home, Search, Grid, ShoppingBag, Star } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function BottomNav() {
  const location = useLocation();
  const { getCartCount, setIsCartOpen } = useCart();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Grid, label: "Categories", path: "/collections" },
    { icon: Star, label: "Specials", path: "/specials" },
    { icon: Search, label: "Search", path: "/collections?q=" }, // or a dedicated search UI
  ];

  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 bg-background border-t border-border z-40 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path || (path !== "/" && location.pathname.startsWith(path.split("?")[0]));
          
          return (
            <Link
              key={label}
              to={path}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
              }`}
            >
              <Icon size={20} className={isActive ? "fill-primary/10" : ""} />
              <span className="text-[10px] font-medium tracking-wide">{label}</span>
            </Link>
          );
        })}
        
        {/* Cart Button acts as a nav item but opens the drawer */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center justify-center w-full h-full space-y-1 text-muted-foreground hover:text-primary transition-colors relative"
        >
          <div className="relative">
            <ShoppingBag size={20} />
            {getCartCount() > 0 && (
              <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-gold text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {getCartCount()}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium tracking-wide">Cart</span>
        </button>
      </div>
    </div>
  );
}
