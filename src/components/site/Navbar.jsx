import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Menu, X, ShoppingBag, ChevronDown, Search } from "lucide-react";
import logo from "@/assets/logo.png";
import { useCart } from "@/context/CartContext";
import { CATEGORIES } from "@/data/products";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showCollections, setShowCollections] = useState(false);
  const [showDresses, setShowDresses] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Initialize local search state from URL if present
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const prevPathname = useRef(location.pathname);

  const { getCartCount, setIsCartOpen } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus when navigating to a DIFFERENT page
  useEffect(() => {
    if (prevPathname.current !== location.pathname) {
      setOpen(false);
      setShowCollections(false);
      setShowDresses(false);
      setIsSearchOpen(false);
      prevPathname.current = location.pathname;
    }
  }, [location.pathname]);

  useEffect(() => {
    setSearchQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSearchChange = (e) => {
    const q = e.target.value;
    setSearchQuery(q);

    if (q.trim()) {
      navigate(`/collections?q=${encodeURIComponent(q)}`, { replace: true });
    } else if (location.pathname === "/collections") {
      navigate(`/collections`, { replace: true });
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setOpen(false);
  };

  const closeMenus = () => {
    setOpen(false);
    setIsSearchOpen(false);
  };

  return (
    <header className="fixed top-0 inset-x-0 z-40">

      <div
        className={`w-full transition-all duration-500 ${scrolled
          ? "bg-background/95 backdrop-blur-xl border-b border-border shadow-sm"
          : "bg-background/80 backdrop-blur-md border-b border-border/50"
          }`}
      >
        {/* Main Header */}
        <nav className="max-w-screen-2xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between relative">

          {/* Mobile Menu Button */}
          <div className="flex-1 lg:hidden">
            <button onClick={() => setOpen(!open)} className="p-2 -ml-2 text-foreground">
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Left: Logo */}
          <div className="flex-1 flex items-center justify-center lg:justify-start gap-3">
            <Link to="/" onClick={closeMenus} className="flex items-center gap-3 group">
              <img src={logo} alt="Alankrita Silks Logo" className="h-12 w-12 md:h-16 md:w-16 object-cover mix-blend-multiply rounded-full" onError={(e) => {
                e.target.style.display = 'none';
              }} />
              <div className="leading-none flex flex-col justify-center pt-1">
                <div className="font-serif text-2xl tracking-widest text-primary font-bold">Alankrita</div>
                <div className="text-[9px] uppercase tracking-[0.2em] text-gold-deep mt-1 font-semibold">
                  A BRAND OF ANNAMMA TRADERS
                </div>
              </div>
            </Link>
          </div>

          {/* Center: Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-center">
            <ul className="flex items-center justify-center gap-8 xl:gap-12 h-12">
              <li>
                <Link
                  to="/"
                  onClick={closeMenus}
                  className={`relative text-xs uppercase tracking-widest transition-colors ${location.pathname === "/" ? "text-primary font-bold" : "text-foreground/70 hover:text-primary"
                    }`}
                >
                  Home
                </Link>
              </li>

              <li
                className="relative h-full flex items-center"
                onMouseEnter={() => setShowCollections(true)}
                onMouseLeave={() => setShowCollections(false)}
              >
                <Link
                  to="/collections"
                  onClick={closeMenus}
                  className={`relative flex items-center gap-1 text-xs uppercase tracking-widest transition-colors h-full ${location.pathname.includes("/collections") ? "text-primary font-bold" : "text-foreground/70 hover:text-primary"
                    }`}
                >
                  Collections <ChevronDown size={14} className={`transition-transform duration-300 ${showCollections ? "rotate-180" : ""}`} />
                </Link>

                <AnimatePresence>
                  {showCollections && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 w-[600px] bg-background border border-border shadow-luxe p-8 rounded-b-sm grid grid-cols-2 gap-8"
                    >
                      <div>
                        <h4 className="text-xs uppercase tracking-[0.3em] text-gold-deep mb-4 border-b border-border pb-2">By Category</h4>
                        <div className="grid grid-cols-1 gap-3">
                          {CATEGORIES.slice(0, 5).map(category => (
                            <Link
                              key={category}
                              to={`/collections?category=${encodeURIComponent(category)}`}
                              onClick={closeMenus}
                              className="text-sm text-muted-foreground hover:text-primary transition"
                            >
                              {category}
                            </Link>
                          ))}
                          {/* Dresses Categories */}
                          {["Party Wear", "Casual Wear", "Sports Wear", "Office Wear", "Festive Wear", "Ethnic Wear"].map(category => (
                            <Link
                              key={category}
                              to={`/dresses/${category.toLowerCase().replace(/ /g, "-")}`}
                              onClick={closeMenus}
                              className="text-sm text-muted-foreground hover:text-primary transition"
                            >
                              {category}
                            </Link>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs uppercase tracking-[0.3em] text-gold-deep mb-4 border-b border-border pb-2">Specials</h4>
                        <div className="grid grid-cols-1 gap-3">
                          {CATEGORIES.slice(5).map(category => (
                            <Link
                              key={category}
                              to={`/collections?category=${encodeURIComponent(category)}`}
                              onClick={closeMenus}
                              className="text-sm text-muted-foreground hover:text-primary transition"
                            >
                              {category}
                            </Link>
                          ))}
                          <Link
                            to="/collections"
                            onClick={closeMenus}
                            className="text-sm text-primary font-serif italic mt-4 hover:text-gold-deep transition"
                          >
                            View Entire Collection &rarr;
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>

              <li
                className="relative h-full flex items-center"
                onMouseEnter={() => setShowDresses(true)}
                onMouseLeave={() => setShowDresses(false)}
              >
                <Link
                  to="/dresses"
                  onClick={closeMenus}
                  className={`relative flex items-center gap-1 text-xs uppercase tracking-widest transition-colors h-full ${location.pathname.includes("/dresses") ? "text-primary font-bold" : "text-foreground/70 hover:text-primary"
                    }`}
                >
                  Dresses <ChevronDown size={14} className={`transition-transform duration-300 ${showDresses ? "rotate-180" : ""}`} />
                </Link>

                <AnimatePresence>
                  {showDresses && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 w-[300px] bg-background border border-border shadow-luxe p-8 rounded-b-sm"
                    >
                      <div>
                        <h4 className="text-xs uppercase tracking-[0.3em] text-gold-deep mb-4 border-b border-border pb-2">Categories</h4>
                        <div className="grid grid-cols-1 gap-3">
                          {["Party Wear", "Casual Wear", "Sports Wear", "Office Wear", "Festive Wear", "Ethnic Wear"].map(category => (
                            <Link
                              key={category}
                              to={`/dresses/${category.toLowerCase().replace(/ /g, "-")}`}
                              onClick={closeMenus}
                              className="text-sm text-muted-foreground hover:text-primary transition"
                            >
                              {category}
                            </Link>
                          ))}
                          <Link
                            to="/dresses"
                            onClick={closeMenus}
                            className="text-sm text-primary font-serif italic mt-4 hover:text-gold-deep transition"
                          >
                            View Entire Collection &rarr;
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>

              <li>
                <Link
                  to="/jewellery"
                  onClick={closeMenus}
                  className={`relative text-xs uppercase tracking-widest transition-colors ${location.pathname === "/jewellery" ? "text-primary font-bold" : "text-foreground/70 hover:text-primary"
                    }`}
                >
                  Jewellery
                </Link>
              </li>

              <li>
                <Link
                  to="/specials"
                  onClick={closeMenus}
                  className={`relative text-xs uppercase tracking-widest transition-colors ${location.pathname === "/specials" ? "text-primary font-bold" : "text-foreground/70 hover:text-primary"
                    }`}
                >
                  Specials
                </Link>
              </li>

              <li>
                <Link
                  to="/testimonials"
                  onClick={closeMenus}
                  className={`relative text-xs uppercase tracking-widest transition-colors ${location.pathname === "/testimonials" ? "text-primary font-bold" : "text-foreground/70 hover:text-primary"
                    }`}
                >
                  Reviews
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  onClick={closeMenus}
                  className={`relative text-xs uppercase tracking-widest transition-colors ${location.pathname === "/about" ? "text-primary font-bold" : "text-foreground/70 hover:text-primary"
                    }`}
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  onClick={closeMenus}
                  className={`relative text-xs uppercase tracking-widest transition-colors ${location.pathname === "/contact" ? "text-primary font-bold" : "text-foreground/70 hover:text-primary"
                    }`}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Right: Search & Cart (Hidden on Mobile) */}
          <div className="flex-1 hidden md:flex items-center justify-end gap-2 sm:gap-4 xl:gap-6">

            {/* Animated Search Bar inline */}
            <motion.div
              initial={false}
              animate={{ width: isSearchOpen ? (window.innerWidth < 640 ? 140 : 250) : (window.innerWidth < 1280 ? 40 : 90) }}
              className="relative flex items-center justify-end h-10 overflow-hidden"
            >
              <AnimatePresence mode="wait">
                {!isSearchOpen ? (
                  <motion.button
                    key="search-btn"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsSearchOpen(true)}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition absolute right-0 whitespace-nowrap px-2"
                  >
                    <Search size={20} />
                    <span className="text-xs uppercase tracking-widest hidden xl:block">Search</span>
                  </motion.button>
                ) : (
                  <motion.div
                    key="search-input"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center gap-2 w-full border-b border-gold pb-1 absolute right-0"
                  >
                    <Search size={16} className="text-muted-foreground shrink-0" />
                    <input
                      type="text"
                      autoFocus
                      value={searchQuery}
                      onChange={handleSearchChange}
                      placeholder="Search..."
                      className="w-full bg-transparent border-none outline-none text-xs uppercase tracking-widest px-1"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setIsSearchOpen(false);
                        if (searchQuery) {
                          setSearchQuery("");
                          if (location.pathname === "/collections") {
                            navigate(`/collections`, { replace: true });
                          }
                        }
                      }}
                      className="text-muted-foreground hover:text-primary transition shrink-0 p-1"
                    >
                      <X size={14} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative hidden lg:flex items-center gap-2 text-foreground hover:text-gold transition group shrink-0"
              aria-label="Cart"
            >
              <ShoppingBag size={22} className="group-hover:scale-110 transition" />
              <span className="text-xs uppercase tracking-widest font-medium hidden sm:block">Cart</span>
              {getCartCount() > 0 && (
                <span className="absolute top-0 right-0 sm:right-auto sm:left-4 w-4 h-4 bg-gold text-white text-[9px] font-bold rounded-full flex items-center justify-center transform translate-x-1 sm:translate-x-3 -translate-y-1">
                  {getCartCount()}
                </span>
              )}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "100vh", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-background absolute top-[110px] inset-x-0 overflow-y-auto"
          >
            <div className="p-6">
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-3 mb-8 pb-4 border-b border-border text-muted-foreground relative">
                <Search size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="SEARCH SAREES..."
                  className="bg-transparent border-none outline-none text-sm uppercase tracking-widest w-full pr-8"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      navigate(`/collections`, { replace: true });
                    }}
                    className="absolute right-0 text-muted-foreground hover:text-primary transition p-1"
                  >
                    <X size={16} />
                  </button>
                )}
              </form>

              <ul className="flex flex-col gap-8">
                <li>
                  <Link to="/" onClick={closeMenus} className="text-xl uppercase tracking-widest text-primary font-serif">Home</Link>
                </li>
                <li>
                  <div className="text-xs text-muted-foreground uppercase tracking-widest mb-4">Categories</div>
                  <div className="grid grid-cols-1 gap-4 pl-4">
                    {CATEGORIES.filter(c => c !== "Jewellery" && c !== "All Collections").map(category => (
                      <Link
                        key={category}
                        to={`/collections?category=${encodeURIComponent(category)}`}
                        onClick={closeMenus}
                        className="text-2xl font-serif text-primary hover:text-gold transition"
                      >
                        {category}
                      </Link>
                    ))}

                    {/* Dedicated Jewellery Link in Mobile Menu */}
                    <Link
                      to="/jewellery"
                      onClick={closeMenus}
                      className="text-2xl font-serif text-gold-deep hover:text-gold transition mt-4 pt-4 border-t border-border"
                    >
                      Exquisite Jewellery
                    </Link>

                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="text-xs text-muted-foreground uppercase tracking-widest mb-4">Dresses</div>
                      <div className="grid grid-cols-1 gap-4 pl-4">
                        {["Party Wear", "Casual Wear", "Sports Wear", "Office Wear", "Festive Wear", "Ethnic Wear"].map(category => (
                          <Link
                            key={category}
                            to={`/dresses/${category.toLowerCase().replace(/ /g, "-")}`}
                            onClick={closeMenus}
                            className="text-2xl font-serif text-primary hover:text-gold transition"
                          >
                            {category}
                          </Link>
                        ))}
                      </div>
                    </div>

                    <Link
                      to="/specials"
                      onClick={closeMenus}
                      className="text-2xl font-serif text-gold-deep hover:text-gold transition mt-2"
                    >
                      Specials
                    </Link>
                  </div>
                </li>
                <li>
                  <Link to="/testimonials" onClick={closeMenus} className="text-xl uppercase tracking-widest text-primary font-serif">Reviews</Link>
                </li>
                <li>
                  <Link to="/about" onClick={closeMenus} className="text-xl uppercase tracking-widest text-primary font-serif">Our Story</Link>
                </li>
                <li>
                  <Link to="/contact" onClick={closeMenus} className="text-xl uppercase tracking-widest text-primary font-serif">Contact</Link>
                </li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
