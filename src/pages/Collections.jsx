import { useState, useMemo, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, ArrowRight, Search, SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "@/components/ecommerce/ProductCard";
import { useAdmin } from "@/context/AdminContext";
import { DRESS_CATEGORY_CARDS } from "@/data/dressProducts";
import { COLOR_OPTIONS, FABRIC_OPTIONS, OCCASION_OPTIONS, PRICE_OPTIONS } from "@/data/searchOptions";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const getAttributeValues = (product, key) => {
  const value = product[key];
  if (Array.isArray(value)) return value.filter(item => typeof item === "string");
  return typeof value === "string" ? value.split(",").map(item => item.trim()).filter(Boolean) : [];
};

const getProductSearchText = (product) => [
  product.name,
  product.category,
  product.description,
  product.id,
  ...["fabric", "color", "occasion"].flatMap(key => getAttributeValues(product, key))
].filter(value => typeof value === "string").join(" ").toLowerCase();

const getAttributeSearchText = (product, key) => {
  const values = getAttributeValues(product, key);
  return values.join(" ").toLowerCase();
};

const getAttributeOptions = (products, key) => [...new Set(
  products.flatMap(product => getAttributeValues(product, key).map(value => value.trim()).filter(Boolean))
)].sort((a, b) => a.localeCompare(b));

function CollectionsPage() {
  const { products: PRODUCTS, categories: CATEGORIES } = useAdmin();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const searchQuery = searchParams.get("q") || "";
  
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const category = searchParams.get("category");
    if (category) {
      setActiveCategory(category);
    } else {
      setActiveCategory("All");
    }
  }, [searchParams]);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    
    // Preserve search query if it exists
    const currentParams = new URLSearchParams(searchParams);
    
    if (category === "All") {
      currentParams.delete("category");
    } else {
      currentParams.set("category", category);
    }
    
    setSearchParams(currentParams, { replace: true });
  };

  const updateSearchParam = (key, value) => {
    const currentParams = new URLSearchParams(searchParams);
    if (value) currentParams.set(key, value);
    else currentParams.delete(key);
    setSearchParams(currentParams, { replace: true });
  };

  const attributeOptions = useMemo(() => ({
    fabric: [...new Set([...FABRIC_OPTIONS, ...getAttributeOptions(PRODUCTS, "fabric")])].sort((a, b) => a.localeCompare(b)),
    color: [...new Set([...COLOR_OPTIONS, ...getAttributeOptions(PRODUCTS, "color")])].sort((a, b) => a.localeCompare(b)),
    occasion: [...new Set([...OCCASION_OPTIONS, ...getAttributeOptions(PRODUCTS, "occasion")])].sort((a, b) => a.localeCompare(b)),
  }), [PRODUCTS]);

  const categoryOptions = useMemo(() => {
    const liveCategories = CATEGORIES.map(category =>
      typeof category === "string" ? category : (category?.name || category?.id || "")
    ).filter(Boolean);
    return [...new Set([
      ...liveCategories,
      ...DRESS_CATEGORY_CARDS.map(category => category.name),
    ])];
  }, [CATEGORIES]);

  const searchSuggestions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];
    return PRODUCTS
      .filter(product => getProductSearchText(product).includes(query))
      .map(product => product.name)
      .filter((name, index, names) => name && names.indexOf(name) === index)
      .slice(0, 8);
  }, [PRODUCTS, searchQuery]);

  const filteredProducts = useMemo(() => {
    let result = PRODUCTS; // AdminContext already includes ALL_DRESS_PRODUCTS
    
    if (activeCategory !== "All") {
      result = result.filter(p => p.category === activeCategory);
    }
    
    const query = searchQuery.trim().toLowerCase();
    if (query) result = result.filter(product => getProductSearchText(product).includes(query));

    for (const key of ["fabric", "color", "occasion"]) {
      const value = (searchParams.get(key) || "").trim().toLowerCase();
      if (value) result = result.filter(product => getAttributeSearchText(product, key).includes(value));
    }

    const minPrice = Number(searchParams.get("minPrice"));
    const maxPrice = Number(searchParams.get("maxPrice"));
    if (searchParams.has("minPrice") && Number.isFinite(minPrice)) {
      result = result.filter(product => Number(product.price) >= minPrice);
    }
    if (searchParams.has("maxPrice") && Number.isFinite(maxPrice)) {
      result = result.filter(product => Number(product.price) <= maxPrice);
    }

    const availability = searchParams.get("availability");
    if (availability === "available") {
      result = result.filter(product =>
        product.availability !== false &&
        product.isAvailable !== false &&
        (product.stock == null || Number(product.stock) > 0)
      );
    } else if (availability === "unavailable") {
      result = result.filter(product =>
        product.availability === false ||
        product.isAvailable === false ||
        (product.stock != null && Number(product.stock) <= 0)
      );
    }

    result = [...result];
    const sort = searchParams.get("sort") || "featured";
    if (sort === "featured") result.sort((a, b) => Number(Boolean(b.isFeatured || b.featured)) - Number(Boolean(a.isFeatured || a.featured)));
    if (sort === "price-low") result.sort((a, b) => Number(a.price) - Number(b.price));
    if (sort === "price-high") result.sort((a, b) => Number(b.price) - Number(a.price));
    if (sort === "name") result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    if (sort === "newest") result.sort((a, b) => Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)));

    return result;
  }, [PRODUCTS, activeCategory, searchQuery, searchParams]);

  const clearFilters = () => {
    const currentParams = new URLSearchParams(searchParams);
    ["fabric", "color", "occasion", "minPrice", "maxPrice", "availability", "sort"].forEach(key => currentParams.delete(key));
    currentParams.delete("category");
    setActiveCategory("All");
    setSearchParams(currentParams, { replace: true });
  };

  const hasAdvancedFilters = ["category", "fabric", "color", "occasion", "minPrice", "maxPrice", "availability", "sort"]
    .some(key => searchParams.has(key));

  const FilterControls = () => (
    <div className="space-y-6">
      <div className="border-b border-border pb-5">
        <label htmlFor="filter-category" className="mb-3 block text-xs font-bold uppercase tracking-[0.18em] text-primary">
          Category
        </label>
        <select
          id="filter-category"
          value={activeCategory}
          onChange={event => handleCategoryChange(event.target.value)}
          className="w-full rounded-sm border border-gold bg-background px-3 py-3 text-sm text-foreground outline-none focus:border-gold"
        >
          <option value="All">All categories</option>
          {categoryOptions.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {["fabric", "color", "occasion"].map(key => (
        <div key={key} className="border-b border-border pb-5">
          <label htmlFor={`filter-${key}`} className="mb-3 block text-xs font-bold uppercase tracking-[0.18em] text-primary">
            {key}
          </label>
          <select
            id={`filter-${key}`}
            value={searchParams.get(key) || ""}
            onChange={event => updateSearchParam(key, event.target.value)}
            className="w-full rounded-sm border border-input bg-background px-3 py-3 text-sm text-foreground outline-none focus:border-gold"
          >
            <option value="">All {key}s</option>
            {attributeOptions[key].map(value => <option key={value} value={value}>{value}</option>)}
          </select>
        </div>
      ))}

      <div className="border-b border-border pb-5">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-primary">Price range</p>
        <select
          value={(() => {
            const min = searchParams.get("minPrice") || "";
            const max = searchParams.get("maxPrice") || "";
            return PRICE_OPTIONS.find(option =>
              String(option.min) === min &&
              (option.max == null ? max === "" : String(option.max) === max)
            )?.value || "";
          })()}
          onChange={event => {
            const option = PRICE_OPTIONS.find(item => item.value === event.target.value);
            const currentParams = new URLSearchParams(searchParams);
            if (option) {
              currentParams.set("minPrice", String(option.min));
              if (option.max == null) currentParams.delete("maxPrice");
              else currentParams.set("maxPrice", String(option.max));
            } else {
              currentParams.delete("minPrice");
              currentParams.delete("maxPrice");
            }
            setSearchParams(currentParams, { replace: true });
          }}
          aria-label="Price range"
          className="w-full rounded-sm border border-input bg-background px-3 py-3 text-sm outline-none focus:border-gold"
        >
          <option value="">All prices</option>
          {PRICE_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      <div className="border-b border-border pb-5">
        <label htmlFor="availability-filter" className="mb-3 block text-xs font-bold uppercase tracking-[0.18em] text-primary">
          Availability
        </label>
        <select
          id="availability-filter"
          value={searchParams.get("availability") || ""}
          onChange={event => updateSearchParam("availability", event.target.value)}
          className="w-full rounded-sm border border-input bg-background px-3 py-3 text-sm outline-none focus:border-gold"
        >
          <option value="">All items</option>
          <option value="available">In stock</option>
          <option value="unavailable">Out of stock</option>
        </select>
      </div>

      {hasAdvancedFilters && (
        <button type="button" onClick={clearFilters} className="text-xs uppercase tracking-widest text-gold-deep hover:text-primary">
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen pt-36 pb-24 px-6 lg:px-10 max-w-screen-2xl mx-auto flex flex-col">
      
      {/* Header & Title */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="font-serif text-5xl md:text-6xl text-primary mb-4">Our Collections</h1>
        <p className="text-muted-foreground text-lg">
          Discover our hand-picked selection of authentic Indian sarees. 
          From Kanchi Pattu to modern designer drapes, find your perfect style.
        </p>
      </div>

      <section className="mb-8" aria-label="Smart search">
        <div className="mx-auto flex max-w-3xl items-center gap-3 rounded-full border border-border bg-background px-5 py-3 shadow-sm transition focus-within:border-gold focus-within:ring-2 focus-within:ring-gold/10">
          <Search size={20} className="shrink-0 text-gold-deep" aria-hidden="true" />
          <input
            id="collection-search"
            type="search"
            value={searchQuery}
            onChange={event => updateSearchParam("q", event.target.value)}
            placeholder="Search by name, fabric, color, occasion..."
            list="collection-product-suggestions"
            autoComplete="off"
            className="w-full bg-transparent py-1 text-base outline-none placeholder:text-muted-foreground/70"
          />
          <datalist id="collection-product-suggestions">
            {searchSuggestions.map(name => <option key={name} value={name} />)}
          </datalist>
          {searchQuery && (
            <button type="button" onClick={() => updateSearchParam("q", "")} className="rounded-full p-1 text-muted-foreground hover:text-primary" aria-label="Clear search">
              <X size={16} />
            </button>
          )}
        </div>
      </section>

      <div className="grid items-start gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="sticky top-[180px] hidden max-h-[calc(100vh-210px)] overflow-y-auto rounded-sm border border-border bg-background p-5 lg:block">
          <div className="mb-5 flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={17} className="text-gold-deep" />
              <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Filters</h2>
            </div>
            {hasAdvancedFilters && (
              <button type="button" onClick={clearFilters} className="text-[11px] uppercase tracking-wider text-gold-deep hover:text-primary">
                Reset
              </button>
            )}
          </div>
          <FilterControls />
        </aside>

        <main className="min-w-0">
          <div className="mb-6 flex items-center justify-between gap-3">
            <p className="text-sm uppercase tracking-wider text-muted-foreground">
              <span className="font-bold text-primary">{filteredProducts.length}</span> products
            </p>
            <div className="flex items-center gap-2">
              <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                <SheetTrigger asChild>
                  <button type="button" className="flex items-center gap-2 rounded-sm border border-border bg-background px-3 py-2 text-xs font-bold uppercase tracking-wider text-primary lg:hidden">
                    <SlidersHorizontal size={15} />
                    Filters
                    {hasAdvancedFilters && <span className="h-2 w-2 rounded-full bg-gold" />}
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[min(88vw,340px)] overflow-y-auto p-5">
                  <SheetHeader className="mb-6 border-b border-border pb-4 pr-8 text-left">
                    <SheetTitle className="flex items-center gap-2 text-primary">
                      <SlidersHorizontal size={17} /> Filters
                    </SheetTitle>
                  </SheetHeader>
                  <FilterControls />
                </SheetContent>
              </Sheet>

              <label htmlFor="collection-sort" className="sr-only">Sort products</label>
              <select
                id="collection-sort"
                value={searchParams.get("sort") || "featured"}
                onChange={event => updateSearchParam("sort", event.target.value)}
                className="rounded-sm border border-border bg-background px-3 py-2 text-xs font-medium text-foreground outline-none focus:border-gold"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to high</option>
                <option value="price-high">Price: High to low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4 md:gap-6"
            >
              <AnimatePresence>
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                  >
                    <ProductCard product={product} index={index} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="py-32 text-center flex flex-col items-center justify-center bg-accent/5 rounded-sm border border-border">
              <Filter size={48} className="text-gold mb-4 opacity-50" />
              <h3 className="font-serif text-2xl text-primary mb-2">No products found</h3>
              <p className="text-muted-foreground mb-6">
                We couldn't find any products matching your search criteria.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {searchQuery && (
                  <button
                    onClick={() => updateSearchParam("q", "")}
                    className="px-8 py-3 bg-gold text-white hover:bg-gold-deep transition rounded-full uppercase text-xs tracking-widest shadow-md"
                  >
                    Clear Search
                  </button>
                )}
                {hasAdvancedFilters && (
                  <button onClick={clearFilters} className="px-8 py-3 border border-gold text-gold-deep hover:bg-gold hover:text-white transition rounded-full uppercase text-xs tracking-widest shadow-md">
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ── Dresses Quick Links ─────────────────────────────── */}
      {/* ── DRESSES COLLECTION ─────────────────────────────── */}
      {activeCategory === "All" && !searchQuery && (
        <div className="mt-24 pt-16 border-t border-border">
          <div className="text-center mb-10">
            <h2 className="font-serif text-5xl md:text-6xl text-primary">DRESSES</h2>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-8">
            {DRESS_CATEGORY_CARDS.map((cat, index) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: (index % 4) * 0.1 }}
                className="group relative flex flex-col bg-background rounded-sm shadow-sm hover:shadow-luxe transition duration-500 overflow-hidden border border-border"
              >
                {/* Image Section - Matches ProductCard exactly */}
                <div className="relative aspect-square overflow-hidden bg-accent/10">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-in-out"
                    loading="lazy"
                  />
                  
                  {/* Hover Actions - Just Quick View to match style */}
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Link 
                      to={`/dresses/${cat.id}`}
                      className="w-12 h-12 rounded-full bg-white text-primary flex items-center justify-center shadow-lg hover:scale-110 hover:bg-gold hover:text-white transition"
                      aria-label="View Category"
                    >
                      <ArrowRight size={20} />
                    </Link>
                  </div>
                </div>

                {/* Details Section - Matches ProductCard exactly */}
                <div className="p-3 md:p-5 flex flex-col flex-1">
                  <div className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1 line-clamp-1">
                    DRESSES
                  </div>
                  <h3 className="font-serif text-sm md:text-lg text-primary line-clamp-1 md:line-clamp-2 mb-2 group-hover:text-gold-deep transition-colors">
                    {cat.name}
                  </h3>
                  <div className="mt-auto flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0">
                    <Link 
                      to={`/dresses/${cat.id}`}
                      className="text-primary font-medium text-xs md:text-base hover:text-gold transition flex items-center gap-1"
                    >
                      View Collection <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CollectionsPage;
