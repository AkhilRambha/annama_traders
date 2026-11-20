import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  ChevronDown,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  UserRound,
  X,
} from "lucide-react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import logo from "@/assets/logo.png";
import { useAdmin } from "@/context/AdminContext";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/products";
import { DRESS_CATEGORY_CARDS } from "@/data/dressProducts";

const ANNOUNCEMENTS = [
  "Discover Our Exclusive Collections",
  "Explore Timeless Sarees & Jewellery",
  "Experience The Annamma Lookbook",
];

const LOOKBOOK_NAV_ITEMS = [
  { label: "Try the Look", to: "/lookbook#try-the-look", detail: "Browse the current saree edit" },
  { label: "Mix & Match Studio", to: "/lookbook#mix-match", detail: "Build a combination from live products" },
  { label: "3D Saree Showcase", to: "/lookbook#saree-showcase", detail: "Explore and zoom product photography" },
  { label: "Shop by Occasion", to: "/lookbook#shop-by-occasion", detail: "Filter looks by occasion" },
  { label: "Personal Style Finder", to: "/lookbook#personal-style-finder", detail: "Find pieces by your preferences" },
];

const getProductSearchText = (product) =>
  [
    product.name,
    product.category,
    product.description,
    product.fabric,
    product.color,
    product.occasion,
  ]
    .flat()
    .filter((value) => typeof value === "string")
    .join(" ")
    .toLowerCase();

function AnnouncementBar({ reduceMotion }) {
  const [announcementIndex, setAnnouncementIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setAnnouncementIndex((index) => (index + 1) % ANNOUNCEMENTS.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="flex h-6 items-center justify-center overflow-hidden bg-maroon-deep px-4 text-center text-[10px] uppercase tracking-[0.18em] text-white sm:text-[11px]">
      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={announcementIndex}
          initial={{ opacity: 0, y: reduceMotion ? 0 : 7 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduceMotion ? 0 : -7 }}
          transition={{ duration: reduceMotion ? 0 : 0.3 }}
          className="whitespace-nowrap"
        >
          <span className="mr-2 text-gold" aria-hidden="true">✦</span>
          {ANNOUNCEMENTS[announcementIndex]}
          <span className="ml-2 text-gold" aria-hidden="true">✦</span>
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

function HeaderLogo({ onClick, compact }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      aria-label="Annamma Traders home"
      className="group flex min-w-0 items-center gap-2.5"
    >
      <img
        src={logo}
        alt=""
        className={`shrink-0 rounded-full object-cover mix-blend-multiply transition-transform duration-300 motion-reduce:transition-none group-hover:scale-[1.03] ${
          compact ? "h-11 w-11 sm:h-12 sm:w-12" : "h-12 w-12 sm:h-14 sm:w-14"
        }`}
      />
      <span className="flex min-w-0 flex-col leading-none">
        <span className="font-serif text-[21px] font-semibold tracking-[0.13em] text-primary sm:text-2xl">
          Alankrita
        </span>
        <span className="mt-1 whitespace-nowrap text-[7px] font-semibold uppercase tracking-[0.16em] text-gold-deep sm:text-[8px]">
          A brand of Annamma Traders
        </span>
      </span>
    </Link>
  );
}

function HeaderAction({ label, onClick, children, disabled = false, badge, buttonRef }) {
  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="relative inline-flex h-10 w-10 items-center justify-center text-primary transition-colors hover:text-gold-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-55"
    >
      {children}
      {badge > 0 && (
        <span className="absolute right-0 top-0 flex h-[17px] min-w-[17px] -translate-y-0.5 translate-x-0.5 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-semibold leading-none text-white ring-2 ring-background">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </button>
  );
}

function CategoryLink({ category, onClick }) {
  return (
    <Link
      to={`/collections?category=${encodeURIComponent(category)}`}
      onClick={onClick}
      className="group/link flex items-center justify-between border-b border-gold/20 py-2.5 text-sm text-foreground/75 transition-colors hover:text-primary motion-reduce:transition-none"
    >
      {category}
      <ArrowUpRight size={14} className="text-gold-deep opacity-0 transition-opacity group-hover/link:opacity-100" aria-hidden="true" />
    </Link>
  );
}

function MegaMenu({ activeMenu, categories, jewelleryAvailable, newArrivalsAvailable, featuredProduct, closeMenus, reduceMotion, scrolled }) {
  if (!activeMenu) return null;

  const menuHeading = {
    sarees: "Sarees, chosen to be treasured",
    jewellery: "The finishing touch",
    collections: "Explore the collection",
    lookbook: "A little inspiration",
  }[activeMenu];

  return (
    <AnimatePresence>
      <motion.div
        key={activeMenu}
        initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: reduceMotion ? 0 : 6 }}
        transition={{ duration: reduceMotion ? 0 : 0.18 }}
        className={`fixed left-1/2 z-50 w-[min(94vw,900px)] -translate-x-1/2 border-t border-gold/50 bg-background shadow-[0_20px_40px_-28px_rgba(54,18,24,0.55)] ${
          scrolled ? "top-[50px]" : "top-[80px]"
        }`}
        role="region"
        aria-label={`${activeMenu} menu`}
      >
        <div className="grid gap-8 p-7 md:grid-cols-[1fr_260px] md:p-9">
          <div>
            <p className="mb-6 font-serif text-2xl text-primary">{menuHeading}</p>
            {activeMenu === "lookbook" ? (
              <ul className="grid gap-x-8 sm:grid-cols-2">
                {LOOKBOOK_NAV_ITEMS.map((item) => (
                  <li key={item.label} className="border-b border-gold/20 py-3">
                    <Link
                      to={item.to}
                      onClick={closeMenus}
                      className="group/lookbook flex items-center justify-between gap-3 text-sm text-foreground/80 transition-colors hover:text-primary"
                    >
                      <span>
                        <span className="block">{item.label}</span>
                        <span className="mt-1 block text-[10px] text-muted-foreground">{item.detail}</span>
                      </span>
                      <ArrowUpRight size={15} className="shrink-0 text-gold-deep transition-transform group-hover/lookbook:translate-x-0.5 group-hover/lookbook:-translate-y-0.5" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : activeMenu === "jewellery" ? (
              <div className="max-w-sm">
                {jewelleryAvailable ? (
                  <Link
                    to="/jewellery"
                    onClick={closeMenus}
                    className="group/link flex items-center justify-between border-b border-gold/20 py-3 text-sm text-foreground/75 transition-colors hover:text-primary"
                  >
                    Shop all jewellery
                    <ArrowUpRight size={14} className="text-gold-deep" aria-hidden="true" />
                  </Link>
                ) : (
                  <p className="py-3 text-sm text-muted-foreground">Explore the jewellery collection.</p>
                )}
              </div>
            ) : categories.length ? (
              <div className="grid gap-x-8 sm:grid-cols-2">
                {categories.map((category) => (
                  <CategoryLink key={category} category={category} onClick={closeMenus} />
                ))}
                {activeMenu === "collections" && newArrivalsAvailable && (
                  <Link
                    to="/collections?sort=newest"
                    onClick={closeMenus}
                    className="border-b border-gold/20 py-2.5 text-sm text-primary hover:text-gold-deep"
                  >
                    New arrivals
                  </Link>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">The collection is being curated.</p>
            )}
            {activeMenu !== "lookbook" && (
              <Link
                to={activeMenu === "jewellery" ? "/jewellery" : "/collections"}
                onClick={closeMenus}
                className="mt-6 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary hover:text-gold-deep"
              >
                {activeMenu === "jewellery"
                  ? "View all jewellery"
                  : activeMenu === "sarees"
                    ? "View all sarees"
                    : "View all collections"}
                <ArrowUpRight size={14} aria-hidden="true" />
              </Link>
            )}
          </div>
          {featuredProduct?.image && activeMenu !== "jewellery" && activeMenu !== "lookbook" ? (
            <Link
              to={`/product/${featuredProduct.id}`}
              onClick={closeMenus}
              className="group relative hidden overflow-hidden bg-secondary md:block"
              aria-label={`Discover ${featuredProduct.name}`}
            >
              <img
                src={featuredProduct.image}
                alt=""
                className="h-full min-h-56 w-full object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none"
                loading="lazy"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-maroon-deep/80 to-transparent px-5 pb-4 pt-12 text-sm text-white">
                Discover the edit <ArrowUpRight size={14} className="ml-1 inline" aria-hidden="true" />
              </span>
            </Link>
          ) : (
            <div className="hidden border-l border-gold/30 pl-7 md:flex md:flex-col md:justify-center">
              <span className="mb-2 text-[10px] uppercase tracking-[0.18em] text-gold-deep">Annamma Traders</span>
              <p className="font-serif text-xl leading-snug text-primary">A thoughtful edit of Indian elegance.</p>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function SearchOverlay({
  isOpen,
  onClose,
  products,
  productsLoaded,
  productsLoadError,
  categories,
  reduceMotion,
}) {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [activeResult, setActiveResult] = useState(-1);
  const inputRef = useRef(null);
  const dialogRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query.trim()), 250);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      setQuery(searchParams.get("q") || "");
      window.requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isOpen, searchParams]);

  useEffect(() => {
    setActiveResult(-1);
  }, [debouncedQuery]);

  const results = useMemo(() => {
    if (!debouncedQuery) return [];
    const term = debouncedQuery.toLowerCase();
    return products
      .filter((product) => getProductSearchText(product).includes(term))
      .slice(0, 6);
  }, [debouncedQuery, products]);

  const suggestedCategories = useMemo(() => {
    if (!debouncedQuery) return [];
    const matchingCategories = new Set(results.map((product) => product.category).filter(Boolean));
    return categories.filter((category) => matchingCategories.has(category)).slice(0, 4);
  }, [categories, debouncedQuery, results]);

  const submitSearch = (event) => {
    event.preventDefault();
    const selected = results[activeResult];
    if (selected) {
      navigate(`/product/${selected.id}`);
    } else {
      navigate(`/collections${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ""}`);
    }
    onClose();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
    } else if (event.key === "Tab") {
      const focusable = dialogRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled])'
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    } else if (event.key === "ArrowDown" && results.length) {
      event.preventDefault();
      setActiveResult((index) => (index + 1) % results.length);
    } else if (event.key === "ArrowUp" && results.length) {
      event.preventDefault();
      setActiveResult((index) => (index <= 0 ? results.length - 1 : index - 1));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.18 }}
          className="fixed inset-0 z-[80] overflow-y-auto bg-background/95 px-4 pb-10 pt-5 backdrop-blur-sm sm:px-8 sm:pt-8"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
          onKeyDown={handleKeyDown}
        >
          <section
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="header-search-title"
            className="mx-auto max-w-4xl"
          >
            <div className="mb-10 flex items-center justify-between border-b border-gold/40 pb-4">
              <span id="header-search-title" className="font-serif text-xl text-primary sm:text-2xl">Find something beautiful</span>
              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center text-primary hover:text-gold-deep"
                aria-label="Close search"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={submitSearch} role="search">
              <label htmlFor="premium-site-search" className="sr-only">Search products</label>
              <div className="flex items-center gap-4 border-b-2 border-primary/70 pb-4">
                <Search size={25} className="shrink-0 text-primary" aria-hidden="true" />
                <input
                  ref={inputRef}
                  id="premium-site-search"
                  type="search"
                  autoComplete="off"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search sarees, jewellery, colours..."
                  aria-controls="header-search-results"
                  aria-activedescendant={activeResult >= 0 ? `search-result-${activeResult}` : undefined}
                  className="w-full bg-transparent font-serif text-2xl text-primary outline-none placeholder:text-muted-foreground/60 sm:text-4xl"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="shrink-0 text-xs uppercase tracking-widest text-muted-foreground hover:text-primary"
                  >
                    Clear
                  </button>
                )}
              </div>
              <p className="mt-3 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Search our current product collection
              </p>
            </form>

            <div id="header-search-results" className="mt-8" aria-live="polite">
              {!debouncedQuery ? (
                <p className="font-serif text-lg text-muted-foreground">Start with a name, category, fabric or colour.</p>
              ) : productsLoadError ? (
                <p className="text-sm text-primary" role="status">Search is unavailable because the product catalogue could not be loaded.</p>
              ) : !productsLoaded ? (
                <p className="text-sm text-muted-foreground" role="status">Loading the collection…</p>
              ) : results.length ? (
                <>
                  {suggestedCategories.length > 0 && (
                    <div className="mb-7 flex flex-wrap items-center gap-2">
                      <span className="mr-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Categories</span>
                      {suggestedCategories.map((category) => (
                        <button
                          key={category}
                          type="button"
                          onClick={() => {
                            navigate(`/collections?category=${encodeURIComponent(category)}`);
                            onClose();
                          }}
                          className="rounded-full border border-gold/50 px-3 py-1.5 text-xs text-primary transition-colors hover:bg-primary hover:text-white"
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  )}
                  <div role="listbox" aria-label="Product suggestions" className="grid gap-3 sm:grid-cols-2">
                    {results.map((product, index) => (
                      <Link
                        key={product.id}
                        id={`search-result-${index}`}
                        to={`/product/${product.id}`}
                        onClick={onClose}
                        role="option"
                        aria-selected={activeResult === index}
                        className={`flex min-w-0 items-center gap-4 border-b border-gold/20 p-2 transition-colors hover:bg-secondary/60 ${
                          activeResult === index ? "bg-secondary/70" : ""
                        }`}
                        aria-current={activeResult === index ? "true" : undefined}
                      >
                        <img
                          src={product.image}
                          alt=""
                          className="h-16 w-16 shrink-0 bg-secondary object-cover"
                          loading="lazy"
                        />
                        <span className="min-w-0">
                          <span className="block truncate font-serif text-base text-primary">{product.name}</span>
                          <span className="mt-1 block text-[10px] uppercase tracking-wider text-muted-foreground">{product.category}</span>
                          <span className="mt-1 block text-sm text-primary">{formatPrice(product.price)}</span>
                        </span>
                      </Link>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigate(`/collections?q=${encodeURIComponent(query.trim())}`);
                      onClose();
                    }}
                    className="mt-6 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary hover:text-gold-deep"
                  >
                    See all search results <ArrowUpRight size={13} className="ml-1 inline" aria-hidden="true" />
                  </button>
                </>
              ) : (
                <p className="font-serif text-lg text-muted-foreground" role="status">
                  {query.trim() ? `No products found for “${query.trim()}”.` : "Enter a search term to begin."}
                </p>
              )}
            </div>
          </section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState("");
  const [activeMenu, setActiveMenu] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef(null);
  const searchTriggerRef = useRef(null);
  const mobileMenuTriggerRef = useRef(null);
  const mobileDialogRef = useRef(null);
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const { products, productsLoaded, productsLoadError } = useAdmin();
  const { getCartCount, setIsCartOpen } = useCart();
  const cartCount = getCartCount();

  const nonSareeCategories = useMemo(
    () => new Set(DRESS_CATEGORY_CARDS.map((category) => category.name.toLowerCase())),
    []
  );
  const productCategories = useMemo(
    () =>
      [...new Set(products.map((product) => product.category).filter((category) => typeof category === "string" && category.trim()))]
        .sort((a, b) => a.localeCompare(b)),
    [products]
  );
  const catalogCategories = useMemo(
    () =>
      productCategories.filter((category) => {
        if (category.toLowerCase() === "jewellery") return false;
        if (!nonSareeCategories.has(category.toLowerCase())) return true;
        return products.some((product) =>
          product.category === category &&
          /saree|pattu|kanchi|banarasi|kalamkari|silk/i.test(`${product.name || ""} ${product.category}`)
        );
      }),
    [nonSareeCategories, productCategories, products]
  );
  const hasJewellery = products.some((product) => String(product.category || "").toLowerCase() === "jewellery");
  const hasNewArrivals = products.some((product) => product.isNew);
  const featuredProduct =
    products.find((product) => product.isFeatured && product.image && catalogCategories.includes(product.category)) ||
    products.find((product) => catalogCategories.includes(product.category) && product.image);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 28);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMobileSection("");
    setActiveMenu("");
    setSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement;
    document.body.style.overflow = "hidden";
    const dialog = mobileDialogRef.current;
    const closeButton = dialog?.querySelector("button[aria-label='Close navigation menu']");
    closeButton?.focus();
    const trapFocus = (event) => {
      if (event.key !== "Tab" || !dialog) return;
      const focusable = dialog.querySelectorAll('a[href], button:not([disabled]), input:not([disabled])');
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", trapFocus);
    return () => {
      document.removeEventListener("keydown", trapFocus);
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus();
      else mobileMenuTriggerRef.current?.focus();
    };
  }, [mobileOpen]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) setActiveMenu("");
    };
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setActiveMenu("");
        setMobileOpen(false);
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const closeMenus = () => {
    setMobileOpen(false);
    setActiveMenu("");
  };

  const closeSearch = () => {
    setSearchOpen(false);
    window.requestAnimationFrame(() => searchTriggerRef.current?.focus());
  };

  const toggleMenu = (menu) => {
    setActiveMenu((current) => (current === menu ? "" : menu));
  };

  const renderDesktopMenuTrigger = (menu, label, href) => (
    <li
      key={menu}
      className="relative flex h-full items-center gap-1"
      onMouseEnter={() => setActiveMenu(menu)}
      onMouseLeave={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setActiveMenu("");
      }}
      onFocus={() => setActiveMenu(menu)}
    >
      <Link
        to={href}
        onClick={closeMenus}
        className={`premium-nav-link relative flex h-full items-center text-[10px] font-medium uppercase tracking-[0.13em] transition-colors hover:text-primary focus-visible:text-primary motion-reduce:transition-none ${
          activeMenu === menu ? "text-primary" : "text-foreground/75"
        }`}
      >
        {label}
        {menu === "lookbook" && <span className="ml-1 text-[9px] text-gold-deep" aria-hidden="true">✦</span>}
      </Link>
      <button
        type="button"
        aria-label={`${activeMenu === menu ? "Close" : "Open"} ${label} menu`}
        aria-expanded={activeMenu === menu}
        aria-haspopup="true"
        onClick={() => toggleMenu(menu)}
        onFocus={() => setActiveMenu(menu)}
        className="flex h-8 w-5 items-center justify-center text-muted-foreground hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <ChevronDown size={13} className={`transition-transform duration-200 motion-reduce:transition-none ${activeMenu === menu ? "rotate-180" : ""}`} />
      </button>
      {activeMenu === menu && (
        <MegaMenu
          activeMenu={menu}
          categories={menu === "jewellery" ? [] : catalogCategories}
          jewelleryAvailable={hasJewellery}
          newArrivalsAvailable={hasNewArrivals}
          featuredProduct={featuredProduct}
          closeMenus={closeMenus}
          reduceMotion={reduceMotion}
          scrolled={scrolled}
        />
      )}
    </li>
  );

  const mobileSections = [
    { key: "sarees", label: "Sarees", href: "/collections", items: catalogCategories },
    { key: "jewellery", label: "Jewellery", href: "/jewellery", items: hasJewellery ? ["Shop all jewellery"] : [] },
    { key: "collections", label: "Collections", href: "/collections", items: catalogCategories },
    { key: "lookbook", label: "The Lookbook", href: "/lookbook", items: LOOKBOOK_NAV_ITEMS },
  ];

  return (
    <>
      <header
        ref={headerRef}
        className="fixed inset-x-0 top-0 z-50"
        onMouseLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setActiveMenu("");
        }}
      >
        <div
          className={`overflow-hidden transition-[height,opacity] duration-300 motion-reduce:transition-none ${
            scrolled ? "h-0 opacity-0" : "h-6 opacity-100"
          }`}
          aria-hidden={scrolled}
        >
          <AnnouncementBar reduceMotion={reduceMotion} />
        </div>

        <div
          className={`relative border-b border-gold/30 bg-background/95 transition-[height,box-shadow] duration-300 motion-reduce:transition-none ${
            scrolled ? "h-[50px] shadow-[0_8px_24px_-20px_rgba(54,18,24,0.55)]" : "h-[56px] shadow-none"
          }`}
        >
          <div className="mx-auto flex h-full max-w-[1500px] items-center justify-between gap-2 px-4 sm:px-7 lg:px-10">
            <button
              type="button"
              ref={mobileMenuTriggerRef}
              onClick={() => {
                setMobileOpen(true);
                setActiveMenu("");
              }}
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
              className="flex h-10 w-10 shrink-0 items-center justify-center text-primary xl:hidden"
            >
              <Menu size={22} strokeWidth={1.6} />
            </button>

            <div className="flex min-w-0 flex-1 items-center justify-center xl:flex-none xl:justify-start">
              <HeaderLogo onClick={closeMenus} compact={scrolled} />
            </div>

            <nav aria-label="Main navigation" className="hidden h-full xl:flex">
              <ul className="flex h-full items-center gap-3 2xl:gap-5">
                <li className="flex h-full items-center">
                  <Link
                    to="/"
                    onClick={closeMenus}
                    className="premium-nav-link relative flex h-full items-center text-[10px] font-medium uppercase tracking-[0.13em] text-foreground/75 transition-colors hover:text-primary"
                  >
                    Home
                  </Link>
                </li>
                {renderDesktopMenuTrigger("sarees", "Sarees", "/collections")}
                {renderDesktopMenuTrigger("jewellery", "Jewellery", "/jewellery")}
                {renderDesktopMenuTrigger("collections", "Collections", "/collections")}
                {renderDesktopMenuTrigger("lookbook", "The Lookbook", null)}
                <li className="flex h-full items-center">
                  <Link
                    to="/collections?sort=newest"
                    onClick={closeMenus}
                    className="premium-nav-link relative flex h-full items-center text-[10px] font-medium uppercase tracking-[0.13em] text-foreground/75 transition-colors hover:text-primary"
                  >
                    New Arrivals
                  </Link>
                </li>
                <li className="flex h-full items-center">
                  <Link
                    to="/about"
                    onClick={closeMenus}
                    className="premium-nav-link relative flex h-full items-center text-[10px] font-medium uppercase tracking-[0.13em] text-foreground/75 transition-colors hover:text-primary"
                  >
                    Our Story
                  </Link>
                </li>
              </ul>
            </nav>

            <div className="flex shrink-0 items-center justify-end gap-0 sm:gap-1">
              <HeaderAction label="Search products" buttonRef={searchTriggerRef} onClick={() => setSearchOpen(true)}>
                <Search size={19} strokeWidth={1.6} />
              </HeaderAction>
              <div className="hidden sm:block">
                <HeaderAction label="Customer account is not available yet" disabled>
                  <UserRound size={19} strokeWidth={1.6} />
                </HeaderAction>
              </div>
              <div className="hidden sm:block">
                <HeaderAction label="Wishlist is not available yet" disabled>
                  <Heart size={19} strokeWidth={1.6} />
                </HeaderAction>
              </div>
              <HeaderAction label={`Open shopping bag${cartCount ? `, ${cartCount} items` : ""}`} onClick={() => setIsCartOpen(true)} badge={cartCount}>
                <ShoppingBag size={19} strokeWidth={1.6} />
              </HeaderAction>
            </div>
          </div>
        </div>

      </header>

      <SearchOverlay
        isOpen={searchOpen}
        onClose={closeSearch}
        products={products}
        productsLoaded={productsLoaded}
        productsLoadError={productsLoadError}
        categories={productCategories}
        reduceMotion={reduceMotion}
      />

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.18 }}
            className="fixed inset-0 z-[70] bg-maroon-deep/35 xl:hidden"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setMobileOpen(false);
            }}
          >
            <motion.aside
              ref={mobileDialogRef}
              initial={{ x: reduceMotion ? 0 : "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: reduceMotion ? 0 : "-100%" }}
              transition={{ duration: reduceMotion ? 0 : 0.24, ease: "easeOut" }}
              className="flex h-full w-[min(88vw,420px)] flex-col bg-background shadow-2xl"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
            >
              <div className="flex h-[76px] shrink-0 items-center justify-between border-b border-gold/30 px-5">
                <HeaderLogo onClick={closeMenus} compact />
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close navigation menu"
                  className="flex h-10 w-10 items-center justify-center text-primary"
                >
                  <X size={22} />
                </button>
              </div>
              <nav aria-label="Mobile navigation" className="min-h-0 flex-1 overflow-y-auto px-5 pb-8">
                <div className="flex items-center justify-between border-b border-gold/20 py-4">
                  <Link to="/" onClick={closeMenus} className="font-serif text-xl text-primary">Home</Link>
                  <span className="text-[9px] uppercase tracking-[0.16em] text-gold-deep">Annamma Traders</span>
                </div>
                {mobileSections.map((section) => (
                  <section key={section.key} className="border-b border-gold/20">
                    <div className="flex items-center justify-between py-4">
                      {section.href ? (
                        <Link to={section.href} onClick={closeMenus} className="font-serif text-xl text-primary">
                          {section.label}
                          {section.key === "lookbook" && <span className="ml-2 text-xs text-gold-deep">✦</span>}
                        </Link>
                      ) : (
                        <span className="font-serif text-xl text-primary">{section.label}</span>
                      )}
                      <button
                        type="button"
                        aria-label={`${mobileSection === section.key ? "Collapse" : "Expand"} ${section.label}`}
                        aria-expanded={mobileSection === section.key}
                        onClick={() => setMobileSection((current) => current === section.key ? "" : section.key)}
                        className="flex h-9 w-9 items-center justify-center text-primary"
                      >
                        <ChevronDown size={18} className={`transition-transform ${mobileSection === section.key ? "rotate-180" : ""}`} />
                      </button>
                    </div>
                    <AnimatePresence initial={false}>
                      {mobileSection === section.key && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: reduceMotion ? 0 : 0.18 }}
                          className="overflow-hidden"
                        >
                          <div className="grid gap-1 pb-4 pl-3">
                            {section.key === "lookbook" ? section.items.map((item) => (
                              <Link
                                key={item.label}
                                to={item.to}
                                onClick={closeMenus}
                                className="flex items-center justify-between gap-3 border-b border-gold/20 py-3 text-sm text-foreground/75 transition-colors hover:text-primary"
                              >
                                <span>
                                  <span className="block">{item.label}</span>
                                  <span className="mt-1 block text-[10px] text-muted-foreground">{item.detail}</span>
                                </span>
                                <ArrowUpRight size={14} className="shrink-0 text-gold-deep" aria-hidden="true" />
                              </Link>
                            )) : section.key === "jewellery" ? (
                              section.items.length ? (
                                <Link to="/jewellery" onClick={closeMenus} className="py-2 text-sm text-foreground/75">Shop all jewellery</Link>
                              ) : (
                                <span className="py-2 text-sm text-muted-foreground">Explore the jewellery collection</span>
                              )
                            ) : section.items.length ? section.items.map((category) => (
                              <CategoryLink key={category} category={category} onClick={closeMenus} />
                            )) : (
                              <span className="py-2 text-sm text-muted-foreground">Browse all collections</span>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </section>
                ))}
                <Link
                  to="/collections?sort=newest"
                  onClick={closeMenus}
                  className="block border-b border-gold/20 py-4 font-serif text-xl text-primary"
                >
                  New Arrivals
                </Link>
                <Link
                  to="/about"
                  onClick={closeMenus}
                  className="block py-4 font-serif text-xl text-primary"
                >
                  Our Story
                </Link>
                <div className="mt-4 flex gap-3 border-t border-gold/20 pt-5 sm:hidden">
                  <HeaderAction label="Customer account is not available yet" disabled>
                    <UserRound size={19} strokeWidth={1.6} />
                  </HeaderAction>
                  <HeaderAction label="Wishlist is not available yet" disabled>
                    <Heart size={19} strokeWidth={1.6} />
                  </HeaderAction>
                </div>
              </nav>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
