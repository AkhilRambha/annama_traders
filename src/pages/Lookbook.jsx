import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Check,
  Crown,
  Gem,
  Flower2,
  Grid2X2,
  Heart,
  LoaderCircle,
  Maximize2,
  Minus,
  Plus,
  Search,
  Shirt,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useAdmin } from "@/context/AdminContext";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/products";

const WISHLIST_STORAGE_KEY = "annamma_lookbook_wishlist";
const SAVED_LOOKS_STORAGE_KEY = "annamma_lookbook_saved";
const EMPTY_FILTERS = {
  occasion: "",
  type: "",
  color: "",
  collection: "",
  minPrice: "",
  maxPrice: "",
};
const LOOKBOOK_EDITS = [
  { id: "bridal", label: "Bridal Edit", icon: Crown, pattern: /bridal|wedding|kundan|polki/i },
  { id: "festive", label: "Festive Edit", icon: Sparkles, pattern: /festive|celebration|occasion|party/i },
  { id: "silk", label: "Silk Stories", icon: Flower2, pattern: /silk|pattu|kanchi|kanjivaram|banarasi/i },
  { id: "daily", label: "Daily Elegance", icon: Flower2, pattern: /cotton|linen|daily|everyday|lightweight|tant/i },
  { id: "designer", label: "Designer Edit", icon: Sparkles, pattern: /designer|organza|georgette|fancy/i },
];

const getAttributeValues = (value) => {
  if (Array.isArray(value)) {
    return value.flatMap((item) => typeof item === "string" ? item.split(",") : [])
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return typeof value === "string"
    ? value.split(",").map((item) => item.trim()).filter(Boolean)
    : [];
};

const getProductValues = (product, key) => {
  const values = getAttributeValues(product[key]);
  if (values.length) return values;
  if (key === "collection" && product.category) return getAttributeValues(product.category);
  if (key === "fabric" && product.category) return getAttributeValues(product.category);
  if (key === "occasion") {
    const text = `${product.name || ""} ${product.description || ""}`.toLowerCase();
    return [
      /bridal|bride|wedding|trousseau/.test(text) ? "Bridal" : "",
      /festive|festival|celebrat|grand occasion|party|evening|festivit/.test(text) ? "Festive & Occasion" : "",
      /daytime|day wear|everyday|daily wear|lightweight/.test(text) ? "Daytime" : "",
    ].filter(Boolean);
  }
  if (key === "color") {
    const text = `${product.name || ""} ${product.description || ""}`.toLowerCase();
    return [
      [/crimson|ruby|scarlet|red/.test(text), "Red"],
      [/emerald|green/.test(text), "Green"],
      [/peacock blue|midnight blue|navy|blue/.test(text), "Blue"],
      [/mustard|yellow/.test(text), "Yellow"],
      [/golden|gold/.test(text), "Gold"],
      [/ivory|cream/.test(text), "Ivory"],
      [/magenta|fuchsia/.test(text), "Magenta"],
      [/pink|rose/.test(text), "Pink"],
      [/lavender|purple|violet/.test(text), "Purple"],
      [/copper/.test(text), "Copper"],
      [/silver/.test(text), "Silver"],
    ].filter(([matches]) => matches).map(([, color]) => color);
  }
  return [];
};

const matchesLookbookEdit = (product, edit) =>
  edit.pattern.test(`${product.name || ""} ${product.category || ""} ${getProductValues(product, "occasion").join(" ")}`);

const hasPrice = (product) =>
  product.price !== null &&
  product.price !== undefined &&
  product.price !== "" &&
  Number.isFinite(Number(product.price));

const isValidProduct = (product) =>
  Boolean(product?.id && product.name && product.image && hasPrice(product));

const isSareeProduct = (product) =>
  /saree|sari|kanchi|kanjivaram|banarasi|pattu|kalamkari|chanderi|organza|mysore silk|soft silk/i.test(
    `${product.name || ""} ${product.category || ""}`
  );

const isJewelleryProduct = (product) =>
  /jewel(?:lery|ry)|earring|necklace|bangle|choker|kundan|polki|maang tikka/i.test(
    `${product.name || ""} ${product.category || ""}`
  );

const isBlouseProduct = (product) =>
  /blouse/i.test(`${product.name || ""} ${product.category || ""}`);

const isAccessoryProduct = (product) =>
  /accessor(?:y|ies)|clutch|potli|handbag|hair|waist belt|footwear|shoe|sandal/i.test(
    `${product.name || ""} ${product.category || ""}`
  );

const isAvailable = (product) =>
  product.availability !== false &&
  product.isAvailable !== false &&
  (product.stock == null || Number(product.stock) > 0);

const normalizeOccasion = (value) => {
  const label = String(value || "").trim();
  const normalized = label.toLowerCase();
  if (/bridal|wedding/.test(normalized)) return { id: "wedding", label: "Wedding", order: 0 };
  if (/festive|festival/.test(normalized)) return { id: "festive", label: "Festive", order: 1 };
  if (/reception|cocktail/.test(normalized)) return { id: "reception", label: "Reception", order: 2 };
  if (/traditional|heritage/.test(normalized)) return { id: "traditional", label: "Traditional", order: 3 };
  if (/party/.test(normalized)) return { id: "party", label: "Party", order: 4 };
  if (/office/.test(normalized)) return { id: "office", label: "Office Wear", order: 5 };
  if (/casual|everyday|daytime/.test(normalized)) return { id: "everyday", label: "Everyday", order: 6 };
  return {
    id: normalized.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    label,
    order: 7,
  };
};

function readStoredArray(key) {
  try {
    const stored = window.localStorage.getItem(key);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error(`Could not read Lookbook data from local storage (${key}):`, error);
    return [];
  }
}

function writeStoredArray(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Could not save Lookbook data to local storage (${key}):`, error);
    toast.error("This item could not be saved on this device.");
    return false;
  }
}

function getUniqueValues(products, getter) {
  return [...new Set(products.flatMap(getter).filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function FilterSelect({ id, label, value, options, onChange }) {
  return (
    <label htmlFor={id} className="block min-w-0">
      <span className="mb-1.5 block text-[9px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{label}</span>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full min-w-0 border-b border-gold/40 bg-transparent py-2 text-sm text-primary outline-none focus:border-primary"
      >
        <option value="">All</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

function MixMatchProductCard({ product, selected, onSelect }) {
  const available = isAvailable(product);
  return (
    <button
      type="button"
      onClick={() => onSelect(product)}
      aria-pressed={selected}
      disabled={!available && !selected}
      className={`group relative min-w-0 overflow-hidden rounded-xl border bg-white text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-55 ${selected ? "border-primary ring-1 ring-primary" : "border-gold/25 hover:border-gold"}`}
    >
      <div className="relative aspect-[1.12/1] overflow-hidden bg-secondary">
        <img src={product.image} alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04] motion-reduce:transition-none" loading="lazy" />
        {selected && (
          <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white shadow" aria-hidden="true">
            <Check size={14} />
          </span>
        )}
        {!available && <span className="absolute inset-x-0 bottom-0 bg-maroon-deep/85 px-2 py-1 text-center text-[8px] uppercase tracking-wider text-white">Out of stock</span>}
      </div>
      <span className="block px-2.5 pb-2.5 pt-2">
        <span className="block truncate font-serif text-xs text-primary sm:text-sm">{product.name}</span>
        <span className="mt-1 block text-[10px] font-medium text-primary">{formatPrice(Number(product.price))}</span>
      </span>
    </button>
  );
}

function ProductDetails({
  product,
  bundleProducts,
  index,
  total,
  wishlistIds,
  cart,
  isAdding,
  selectedQuantity,
  onAddProduct,
  onAddLook,
  onSaveLook,
  onToggleWishlist,
  onRemoveOptional,
  onQuantityChange,
}) {
  if (!product) return null;

  const purchasable = bundleProducts.filter((item) => {
    const alreadyInCart = Number(cart.find((cartItem) => cartItem.id === item.id)?.quantity || 0);
    const quantity = item.id === product.id ? selectedQuantity : 1;
    return isAvailable(item) && (item.stock == null || Number(item.stock) >= alreadyInCart + quantity);
  });
  const subtotal = purchasable.reduce((sum, item) => sum + Number(item.price) * (item.id === product.id ? selectedQuantity : 1), 0);
  const unavailableCount = bundleProducts.length - purchasable.length;
  const isWishlisted = wishlistIds.includes(product.id);
  const remainingStock = product.stock == null
    ? 99
    : Math.max(0, Number(product.stock) - Number(cart.find((cartItem) => cartItem.id === product.id)?.quantity || 0));

  return (
    <div>
      <div className="mb-3 flex items-center justify-between border-b border-gold/30 pb-3">
        <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-gold-deep">Your selected look</span>
        <span className="font-serif text-lg text-primary">
          {String(index + 1).padStart(2, "0")} <span className="text-muted-foreground">/ {String(total).padStart(2, "0")}</span>
        </span>
      </div>

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-gold-deep">{product.category || "Saree"}</p>
          <h2 className="line-clamp-2 font-serif text-2xl leading-tight text-primary sm:text-3xl">{product.name}</h2>
        </div>
        <button
          type="button"
          onClick={() => onToggleWishlist(product.id)}
          aria-label={isWishlisted ? "Remove selected saree from wishlist" : "Add selected saree to wishlist"}
          aria-pressed={isWishlisted}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/40 text-primary transition-colors hover:bg-secondary"
        >
          <Heart size={20} className={isWishlisted ? "fill-current" : ""} />
        </button>
      </div>
      {product.description && <p className="mt-1 line-clamp-1 text-[11px] leading-4 text-muted-foreground">{product.description}</p>}

      <div className="my-3 border-y border-gold/25">
        {bundleProducts.map((item) => {
          const canAdd = isAvailable(item) &&
            (item.stock == null || Number(item.stock) > Number(cart.find((cartItem) => cartItem.id === item.id)?.quantity || 0));
          return (
            <div key={item.id} className="flex items-center gap-3 border-b border-gold/15 py-2.5 last:border-b-0">
              <Link to={`/product/${item.id}`} className="h-14 w-14 shrink-0 bg-secondary">
                <img src={item.image} alt="" className="h-full w-full object-cover" loading="lazy" />
              </Link>
              <div className="min-w-0 flex-1">
                <Link to={`/product/${item.id}`} className="block truncate font-serif text-sm text-primary hover:text-gold-deep">
                  {item.name}
                </Link>
                <span className="mt-0.5 block truncate text-[10px] text-muted-foreground">{item.category} <span aria-hidden="true">·</span> {formatPrice(Number(item.price))}</span>
                <span className={`mt-0.5 block text-[8px] uppercase tracking-wider ${canAdd ? "text-emerald-800" : "text-destructive"}`}>
                  {canAdd ? "Available" : "Unavailable"}
                </span>
              </div>
              <div className="flex shrink-0 flex-col items-center gap-2">
                {item.id !== product.id && (
                  <button
                    type="button"
                    onClick={() => onRemoveOptional(item.id)}
                    aria-label={`Remove ${item.name} from this look`}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-primary"
                  >
                    <X size={15} />
                  </button>
                )}
                {item.id === product.id ? (
                  <div className="flex items-center border border-gold/40">
                    <button
                      type="button"
                      onClick={() => onQuantityChange(Math.max(1, selectedQuantity - 1))}
                      disabled={selectedQuantity <= 1}
                      aria-label="Decrease selected saree quantity"
                      className="flex h-9 w-8 items-center justify-center text-primary disabled:opacity-35"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="min-w-6 text-center text-xs text-primary" aria-live="polite">{selectedQuantity}</span>
                    <button
                      type="button"
                      onClick={() => onQuantityChange(Math.min(remainingStock, selectedQuantity + 1))}
                      disabled={selectedQuantity >= remainingStock}
                      aria-label="Increase selected saree quantity"
                      className="flex h-9 w-8 items-center justify-center text-primary disabled:opacity-35"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => onAddProduct(item)}
                    disabled={!canAdd || isAdding}
                    aria-label={`Add ${item.name} to cart`}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/40 text-primary transition-colors hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Plus size={15} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mb-3 flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Available look total</span>
        <span className="font-serif text-2xl text-primary">{formatPrice(subtotal)}</span>
      </div>
      {unavailableCount > 0 && (
        <p className="mb-4 text-xs leading-5 text-muted-foreground">
          {unavailableCount} selected {unavailableCount === 1 ? "piece is" : "pieces are"} unavailable and will be skipped.
        </p>
      )}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onAddLook}
          disabled={!purchasable.length || isAdding}
          className="flex min-h-11 min-w-0 flex-1 items-center justify-center gap-2 bg-primary px-3 text-[9px] font-semibold uppercase tracking-[0.12em] text-primary-foreground transition-colors hover:bg-maroon-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none sm:text-[10px]"
        >
          {isAdding ? "Adding pieces…" : "Add selected look to cart"}
          {isAdding ? <LoaderCircle size={15} className="shrink-0 animate-spin" /> : <ShoppingBag size={15} className="shrink-0" />}
        </button>
        <button
          type="button"
          onClick={onSaveLook}
          aria-label="Save complete look"
          title="Save complete look"
          className="flex h-11 w-11 shrink-0 items-center justify-center border border-gold/45 text-primary transition-colors hover:bg-secondary"
        >
          <Bookmark size={18} />
        </button>
      </div>
      <p className="mt-1 text-center text-[8px] leading-3 text-muted-foreground">
        Live catalogue pricing · no bundle discount
      </p>
    </div>
  );
}

function EmptyLookbook({ loading, error }) {
  if (loading) {
    return (
      <div className="flex min-h-[360px] flex-col items-center justify-center gap-4 text-center text-muted-foreground">
        <LoaderCircle size={24} className="animate-spin text-gold-deep motion-reduce:animate-none" aria-hidden="true" />
        <p role="status">Loading the collection…</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="mx-auto flex min-h-[360px] max-w-lg flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="font-serif text-2xl text-primary">The collection is unavailable right now.</p>
        <p className="text-sm leading-6 text-muted-foreground" role="alert">The product catalogue could not be loaded. Please try again later.</p>
      </div>
    );
  }
  return (
    <div className="mx-auto flex min-h-[360px] max-w-lg flex-col items-center justify-center gap-4 px-6 text-center">
      <Sparkles size={24} className="text-gold-deep" aria-hidden="true" />
      <p className="font-serif text-2xl text-primary">A new edit is on its way.</p>
      <p className="text-sm leading-6 text-muted-foreground">There are no saree product photographs in the current catalogue to feature yet.</p>
      <Link to="/collections" className="text-xs font-semibold uppercase tracking-widest text-primary hover:text-gold-deep">Browse the collection</Link>
    </div>
  );
}

export default function LookbookPage() {
  const { products, productsLoaded, productsLoadError } = useAdmin();
  const { cart, addToCart, setIsCartOpen } = useCart();
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedBlouseId, setSelectedBlouseId] = useState("");
  const [selectedJewelleryId, setSelectedJewelleryId] = useState("");
  const [selectedAccessoryId, setSelectedAccessoryId] = useState("");
  const [activeMixCategory, setActiveMixCategory] = useState("saree");
  const [activeOccasionId, setActiveOccasionId] = useState("");
  const [occasionScrollProgress, setOccasionScrollProgress] = useState(0);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS);
  const [activeEdit, setActiveEdit] = useState("all");
  const [finder, setFinder] = useState({ occasion: "", color: "", maxPrice: "" });
  const [mobileDetailsOpen, setMobileDetailsOpen] = useState(false);
  const [isCarouselVisible, setIsCarouselVisible] = useState(false);
  const [expandedLook, setExpandedLook] = useState(false);
  const [wishlistIds, setWishlistIds] = useState(() => readStoredArray(WISHLIST_STORAGE_KEY).filter((id) => typeof id === "string"));
  const [savedLooks, setSavedLooks] = useState(() => readStoredArray(SAVED_LOOKS_STORAGE_KEY).filter((look) => look && typeof look.id === "string"));
  const [isAdding, setIsAdding] = useState(false);
  const [showcaseZoom, setShowcaseZoom] = useState(1);
  const [showcaseImage, setShowcaseImage] = useState("");
  const addingRef = useRef(false);
  const mobileDetailsTriggerRef = useRef(null);
  const mobileDetailsCloseRef = useRef(null);
  const mobileDetailsDialogRef = useRef(null);
  const expandedLookCloseRef = useRef(null);
  const mixProductsRef = useRef(null);
  const occasionCarouselRef = useRef(null);

  const catalogProducts = useMemo(() => products.filter(isValidProduct), [products]);
  const sareeProducts = useMemo(
    () => catalogProducts
      .filter(isSareeProduct)
      .sort((a, b) => Number(Boolean(b.isFeatured || b.featured)) - Number(Boolean(a.isFeatured || a.featured))),
    [catalogProducts]
  );
  const blouseProducts = useMemo(() => catalogProducts.filter(isBlouseProduct), [catalogProducts]);
  const jewelleryProducts = useMemo(() => catalogProducts.filter(isJewelleryProduct), [catalogProducts]);
  const accessoryProducts = useMemo(
    () => catalogProducts.filter((product) => isAccessoryProduct(product) &&
      !isSareeProduct(product) && !isBlouseProduct(product) && !isJewelleryProduct(product)),
    [catalogProducts]
  );

  const occasionOptions = useMemo(() => getUniqueValues(sareeProducts, (product) => getProductValues(product, "occasion")), [sareeProducts]);
  const occasionShowcases = useMemo(() => {
    const groups = new Map();
    catalogProducts.forEach((product) => {
      getProductValues(product, "occasion").forEach((value) => {
        const occasion = normalizeOccasion(value);
        if (!occasion.id) return;
        if (!groups.has(occasion.id)) groups.set(occasion.id, { ...occasion, products: [] });
        const group = groups.get(occasion.id);
        if (!group.products.some((item) => item.id === product.id)) group.products.push(product);
      });
    });
    return [...groups.values()].sort((a, b) => a.order - b.order || a.label.localeCompare(b.label));
  }, [catalogProducts]);
  const typeOptions = useMemo(() => getUniqueValues(sareeProducts, (product) => getProductValues(product, "fabric")), [sareeProducts]);
  const colorOptions = useMemo(() => getUniqueValues(sareeProducts, (product) => getProductValues(product, "color")), [sareeProducts]);
  const collectionOptions = useMemo(() => getUniqueValues(sareeProducts, (product) => getProductValues(product, "collection")), [sareeProducts]);
  const priceOptions = useMemo(
    () => [...new Set(sareeProducts.map((product) => Number(product.price)).filter(Number.isFinite))].sort((a, b) => a - b),
    [sareeProducts]
  );
  const priceBounds = useMemo(() => {
    const prices = sareeProducts.map((product) => Number(product.price)).filter(Number.isFinite);
    return {
      min: prices.length ? Math.min(...prices) : 0,
      max: prices.length ? Math.max(...prices) : 0,
    };
  }, [sareeProducts]);
  const availableEdits = useMemo(() => LOOKBOOK_EDITS.filter((edit) =>
    sareeProducts.some((product) => matchesLookbookEdit(product, edit))
  ), [sareeProducts]);

  const filteredLooks = useMemo(() => sareeProducts.filter((product) => {
    const matches = (key, filterValue) => {
      if (!filterValue) return true;
      return getProductValues(product, key).some((value) => value.toLowerCase() === filterValue.toLowerCase());
    };
    const edit = LOOKBOOK_EDITS.find((item) => item.id === activeEdit);
    if (edit && !matchesLookbookEdit(product, edit)) return false;
    const price = Number(product.price);
    return matches("occasion", appliedFilters.occasion) &&
      matches("fabric", appliedFilters.type) &&
      matches("color", appliedFilters.color) &&
      matches("collection", appliedFilters.collection) &&
      (!appliedFilters.minPrice || price >= Number(appliedFilters.minPrice)) &&
      (!appliedFilters.maxPrice || price <= Number(appliedFilters.maxPrice));
  }), [activeEdit, appliedFilters, sareeProducts]);

  const selectedProduct = filteredLooks.find((product) => product.id === selectedProductId) || filteredLooks[0] || null;
  const selectedIndex = selectedProduct ? filteredLooks.findIndex((product) => product.id === selectedProduct.id) : 0;
  const visibleCarouselSlides = filteredLooks
    .map((product, index) => {
      const relativeIndex = (index - selectedIndex + filteredLooks.length) % filteredLooks.length;
      const offset = relativeIndex > Math.floor(filteredLooks.length / 2)
        ? relativeIndex - filteredLooks.length
        : relativeIndex;
      return { product, index, offset, active: product.id === selectedProduct?.id, distance: Math.abs(offset) };
    })
    .filter((slide) => slide.distance <= 1);
  const selectedBlouse = catalogProducts.find((product) => product.id === selectedBlouseId) || null;
  const selectedJewellery = catalogProducts.find((product) => product.id === selectedJewelleryId) || null;
  const selectedAccessory = catalogProducts.find((product) => product.id === selectedAccessoryId) || null;
  const activeOccasionGroup = occasionShowcases.find((group) => group.id === activeOccasionId) || occasionShowcases[0] || null;
  const bundleProducts = [selectedProduct, selectedBlouse, selectedJewellery, selectedAccessory]
    .filter(Boolean)
    .filter((product, index, list) => list.findIndex((item) => item.id === product.id) === index);
  const productById = useMemo(() => new Map(catalogProducts.map((product) => [product.id, product])), [catalogProducts]);
  const savedLookDetails = savedLooks.map((look) => ({
    ...look,
    products: (Array.isArray(look.productIds) ? look.productIds : [])
      .map((id) => productById.get(id))
      .filter(Boolean),
  }));
  const mobileWishlistProducts = wishlistIds.map((id) => productById.get(id)).filter(Boolean);

  useEffect(() => {
    if (!filteredLooks.some((product) => product.id === selectedProductId)) {
      setSelectedProductId(filteredLooks[0]?.id || "");
      setSelectedQuantity(1);
    }
  }, [filteredLooks, selectedProductId]);
  useEffect(() => {
    setSelectedQuantity(1);
  }, [selectedProductId]);

  useEffect(() => {
    if (!selectedProduct) {
      setShowcaseImage("");
      return;
    }
    setShowcaseImage(selectedProduct.image);
    setShowcaseZoom(1);
  }, [selectedProduct?.id, selectedProduct?.image]);

  useEffect(() => {
    if (!location.hash) return undefined;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [location.hash, productsLoaded, reduceMotion]);

  useEffect(() => {
    const carousel = document.querySelector('#try-the-look [aria-roledescription="carousel"]');
    if (!carousel) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      setIsCarouselVisible(entry.isIntersecting && entry.intersectionRatio >= 0.5);
    }, { threshold: [0, 0.5] });
    observer.observe(carousel);
    return () => observer.disconnect();
  }, [productsLoaded, sareeProducts.length]);

  useEffect(() => {
    if (!mobileDetailsOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement;
    const dialog = mobileDetailsDialogRef.current;
    document.body.style.overflow = "hidden";
    mobileDetailsCloseRef.current?.focus();
    const handleDialogKeys = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setMobileDetailsOpen(false);
        return;
      }
      if (event.key !== "Tab" || !dialog) return;
      const focusable = dialog.querySelectorAll('a[href], button:not([disabled])');
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
    document.addEventListener("keydown", handleDialogKeys);
    return () => {
      document.removeEventListener("keydown", handleDialogKeys);
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus();
      else mobileDetailsTriggerRef.current?.focus();
    };
  }, [mobileDetailsOpen]);

  useEffect(() => {
    if (!expandedLook) return undefined;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement;
    document.body.style.overflow = "hidden";
    expandedLookCloseRef.current?.focus();
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setExpandedLook(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus();
    };
  }, [expandedLook]);

  const updateFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }));
  const selectAt = (index) => {
    if (!filteredLooks.length) return;
    const wrapped = (index + filteredLooks.length) % filteredLooks.length;
    setSelectedProductId(filteredLooks[wrapped].id);
  };
  const handleCarouselKeyDown = (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      selectAt(selectedIndex - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      selectAt(selectedIndex + 1);
    }
  };

  const canAddProduct = (product) => {
    if (!isAvailable(product)) return false;
    const quantityInCart = Number(cart.find((item) => item.id === product.id)?.quantity || 0);
    return product.stock == null || Number(product.stock) > quantityInCart;
  };

  const addProductsToCart = async (requestedProducts, quantityOverrides = {}) => {
    if (addingRef.current) return;
    const uniqueProducts = [...new Map(requestedProducts.filter(Boolean).map((product) => [product.id, product])).values()];
    const purchasable = uniqueProducts.filter(canAddProduct);
    if (!purchasable.length) {
      toast.error("No selected pieces are currently available to add.");
      return;
    }

    addingRef.current = true;
    setIsAdding(true);
    const failed = [];
    let added = 0;
    try {
      for (const product of purchasable) {
        try {
          const inCart = Number(cart.find((item) => item.id === product.id)?.quantity || 0);
          const remaining = product.stock == null ? Number.MAX_SAFE_INTEGER : Math.max(0, Number(product.stock) - inCart);
          const requestedQuantity = Number(quantityOverrides[product.id]) || 1;
          addToCart(product, { openCart: false, quantity: Math.min(requestedQuantity, remaining) });
          added += 1;
        } catch (error) {
          console.error(`Could not add ${product.name} to cart:`, error);
          failed.push(product.name);
        }
      }
      if (added) {
        setIsCartOpen(true);
        toast.success(`${added} ${added === 1 ? "piece" : "pieces"} added to your cart.`);
      }
      if (failed.length || purchasable.length !== uniqueProducts.length) {
        toast.error("Some unavailable pieces were skipped.", {
          description: failed.length ? failed.join(", ") : "Check the stock status in your selected look.",
        });
      }
    } finally {
      addingRef.current = false;
      setIsAdding(false);
    }
  };

  const toggleWishlist = (productId) => {
    const next = wishlistIds.includes(productId)
      ? wishlistIds.filter((id) => id !== productId)
      : [...wishlistIds, productId];
    if (!writeStoredArray(WISHLIST_STORAGE_KEY, next)) return;
    setWishlistIds(next);
    toast.success(next.includes(productId) ? "Saved to your wishlist on this device." : "Removed from your wishlist.");
  };

  const saveCurrentLook = () => {
    if (!bundleProducts.length) return;
    const productIds = bundleProducts.map((product) => product.id);
    const duplicate = savedLooks.some((look) =>
      Array.isArray(look.productIds) &&
      look.productIds.length === productIds.length &&
      productIds.every((id) => look.productIds.includes(id))
    );
    if (duplicate) {
      toast.message("This combination is already saved on this device.");
      return;
    }
    const newLook = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title: selectedProduct?.name || "Saved look",
      productIds,
      savedAt: new Date().toISOString(),
    };
    const next = [newLook, ...savedLooks];
    if (!writeStoredArray(SAVED_LOOKS_STORAGE_KEY, next)) return;
    setSavedLooks(next);
    toast.success("Your look was saved on this device.");
  };

  const removeSavedLook = (lookId) => {
    const next = savedLooks.filter((look) => look.id !== lookId);
    if (!writeStoredArray(SAVED_LOOKS_STORAGE_KEY, next)) return;
    setSavedLooks(next);
    toast.success("Saved look removed.");
  };

  const loadSavedLook = (look) => {
    const savedProducts = (look.productIds || []).map((id) => productById.get(id)).filter(Boolean);
    const saree = savedProducts.find(isSareeProduct);
    if (!saree) {
      toast.error("The saree in this saved look is no longer in the catalogue.");
      return;
    }
    setFilters(EMPTY_FILTERS);
    setAppliedFilters(EMPTY_FILTERS);
    setActiveEdit("all");
    setSelectedProductId(saree.id);
    setSelectedBlouseId(savedProducts.find(isBlouseProduct)?.id || "");
    setSelectedJewelleryId(savedProducts.find(isJewelleryProduct)?.id || "");
    setSelectedAccessoryId(savedProducts.find(isAccessoryProduct)?.id || "");
    document.getElementById("try-the-look")?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  };

  const applyStyleFinder = (event) => {
    event.preventDefault();
    setFilters({
      ...EMPTY_FILTERS,
      occasion: finder.occasion,
      color: finder.color,
      maxPrice: finder.maxPrice,
    });
    setAppliedFilters({
      ...EMPTY_FILTERS,
      occasion: finder.occasion,
      color: finder.color,
      maxPrice: finder.maxPrice,
    });
    setActiveEdit("all");
    document.getElementById("try-the-look")?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    toast.success("Your preferences are applied to the Lookbook.");
  };

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  };

  const clearOptionalPiece = (productId) => {
    if (selectedBlouseId === productId) setSelectedBlouseId("");
    if (selectedJewelleryId === productId) setSelectedJewelleryId("");
    if (selectedAccessoryId === productId) setSelectedAccessoryId("");
  };

  const mixCategories = [
    { id: "saree", label: "Saree", icon: Shirt, products: sareeProducts, selectedId: selectedProduct?.id || "" },
    { id: "blouse", label: "Blouse", icon: Shirt, products: blouseProducts, selectedId: selectedBlouseId },
    { id: "jewellery", label: "Jewellery", icon: Gem, products: jewelleryProducts, selectedId: selectedJewelleryId },
    { id: "accessories", label: "Accessories", icon: Sparkles, products: accessoryProducts, selectedId: selectedAccessoryId },
  ];
  const activeMixTab = mixCategories.find((category) => category.id === activeMixCategory) || mixCategories[0];
  const activeMixProducts = activeMixTab?.products || [];
  const selectMixProduct = (categoryId, product) => {
    if (categoryId === "saree") {
      setFilters(EMPTY_FILTERS);
      setAppliedFilters(EMPTY_FILTERS);
      setActiveEdit("all");
      setSelectedProductId(product.id);
      return;
    }
    const setters = {
      blouse: [selectedBlouseId, setSelectedBlouseId],
      jewellery: [selectedJewelleryId, setSelectedJewelleryId],
      accessories: [selectedAccessoryId, setSelectedAccessoryId],
    };
    const [selectedId, setSelectedId] = setters[categoryId];
    setSelectedId(selectedId === product.id ? "" : product.id);
  };
  const scrollMixProducts = (direction) => {
    mixProductsRef.current?.scrollBy({
      left: direction * Math.max(220, mixProductsRef.current.clientWidth * 0.8),
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };
  const selectOccasionGroup = (groupId) => {
    setActiveOccasionId(groupId);
    setOccasionScrollProgress(0);
    if (occasionCarouselRef.current) occasionCarouselRef.current.scrollTo({ left: 0, behavior: reduceMotion ? "auto" : "smooth" });
  };
  const scrollOccasionCarousel = (direction) => {
    occasionCarouselRef.current?.scrollBy({
      left: direction * Math.max(250, occasionCarouselRef.current.clientWidth * 0.8),
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  const clearAllFilters = () => {
    setFilters(EMPTY_FILTERS);
    setAppliedFilters(EMPTY_FILTERS);
    setActiveEdit("all");
  };
  const applyFilters = (event) => {
    event.preventDefault();
    setAppliedFilters(filters);
    setActiveEdit("all");
    scrollTo("try-the-look");
  };
  const setPriceBound = (bound, value) => {
    setFilters((current) => {
      const next = { ...current, [bound]: String(value) };
      if (bound === "minPrice" && next.maxPrice && value > Number(next.maxPrice)) next.maxPrice = String(value);
      if (bound === "maxPrice" && next.minPrice && value < Number(next.minPrice)) next.minPrice = String(value);
      return next;
    });
  };

  const selectedLabel = selectedProduct
    ? `${selectedProduct.name}${selectedProduct.category ? ` · ${selectedProduct.category}` : ""}`
    : "";
  const previewImage = showcaseImage || selectedProduct?.image || "";
  const previewImages = selectedProduct
    ? [...new Set([selectedProduct.image, ...(Array.isArray(selectedProduct.images) ? selectedProduct.images : [])].filter(Boolean))]
    : [];
  const purchasableBundleProducts = bundleProducts.filter(canAddProduct);
  const mixMatchTotal = purchasableBundleProducts.reduce((sum, product) => sum + Number(product.price), 0);

  return (
    <div className="min-h-screen overflow-x-clip bg-background pb-24 pt-20 md:pb-0">
      <header className="relative overflow-hidden border-b border-gold/25 bg-[radial-gradient(ellipse_at_50%_-40%,rgba(255,255,255,0.96),transparent_68%),linear-gradient(110deg,#f6eadb_0%,#fffaf1_48%,#f1dfca_100%)] px-5 pb-0 pt-7 sm:px-8 sm:pt-9">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-full opacity-25" aria-hidden="true">
          <div className="absolute -left-16 -top-16 h-56 w-56 rounded-full border border-gold/60" />
          <div className="absolute -left-10 -top-10 h-44 w-44 rounded-full border border-gold/40" />
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full border border-gold/60" />
          <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full border border-gold/40" />
        </div>
        <div className="relative mx-auto max-w-[1600px] text-center">
          <Flower2 size={26} strokeWidth={1.3} className="mx-auto mb-1 text-gold-deep" aria-hidden="true" />
          <div className="flex items-center justify-center gap-3 sm:gap-5">
            <span className="hidden h-px w-16 bg-gradient-to-r from-transparent to-gold-deep sm:block" aria-hidden="true" />
            <h1 className="font-serif text-4xl leading-none text-primary sm:text-5xl">The Lookbook</h1>
            <span className="hidden h-px w-16 bg-gradient-to-l from-transparent to-gold-deep sm:block" aria-hidden="true" />
          </div>
          <p className="mt-2 text-xs text-muted-foreground sm:text-sm">Curated Drapes <span className="mx-1 text-gold-deep">•</span> Handpicked Textures <span className="mx-1 text-gold-deep">•</span> Complete Looks</p>
        </div>
        <nav aria-label="Lookbook edits" className="relative mx-auto mt-5 flex max-w-[1300px] gap-2 overflow-x-auto pb-3 sm:justify-center sm:gap-4">
          <button
            type="button"
            aria-pressed={activeEdit === "all"}
            onClick={() => setActiveEdit("all")}
            className={`flex min-h-10 shrink-0 items-center gap-2 rounded-full px-4 text-[10px] font-semibold transition-colors sm:px-5 sm:text-xs ${activeEdit === "all" ? "bg-primary text-white shadow-sm" : "text-primary hover:bg-white/60"}`}
          >
            <Grid2X2 size={15} /> All Looks
          </button>
          {availableEdits.map((edit) => {
            const Icon = edit.icon;
            return (
              <button
                key={edit.id}
                type="button"
                aria-pressed={activeEdit === edit.id}
                onClick={() => setActiveEdit(edit.id)}
                className={`flex min-h-10 shrink-0 items-center gap-2 rounded-full px-3 text-[10px] font-semibold transition-colors sm:px-4 sm:text-xs ${activeEdit === edit.id ? "bg-primary text-white shadow-sm" : "text-primary hover:bg-white/60"}`}
              >
                <Icon size={15} strokeWidth={1.7} /> {edit.label}
              </button>
            );
          })}
        </nav>
      </header>

      {!productsLoaded || productsLoadError || sareeProducts.length === 0 ? (
        <EmptyLookbook loading={!productsLoaded && !productsLoadError} error={Boolean(productsLoadError)} />
      ) : (
        <>
          <section id="try-the-look" className="mx-auto w-full max-w-[1500px] scroll-mt-24 px-4 sm:px-7 lg:px-10">
            <form onSubmit={applyFilters} className="border-b border-gold/20 bg-[#fffaf4]/90 py-4">
              <div className="mx-auto grid max-w-[1500px] items-end gap-x-5 gap-y-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_1.25fr_auto_auto]">
                <FilterSelect id="lookbook-occasion" label="Occasion" value={filters.occasion} options={occasionOptions} onChange={(value) => updateFilter("occasion", value)} />
                <FilterSelect id="lookbook-type" label="Saree type" value={filters.type} options={typeOptions} onChange={(value) => updateFilter("type", value)} />
                <FilterSelect id="lookbook-color" label="Color" value={filters.color} options={colorOptions} onChange={(value) => updateFilter("color", value)} />
                <FilterSelect id="lookbook-collection" label="Collection" value={filters.collection} options={collectionOptions} onChange={(value) => updateFilter("collection", value)} />
                <div className="min-w-0">
                  <div className="mb-1.5 flex items-center justify-between gap-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    <span>Price range</span>
                    <span className="whitespace-nowrap normal-case tracking-normal">
                      {formatPrice(filters.minPrice ? Number(filters.minPrice) : priceBounds.min)} – {formatPrice(filters.maxPrice ? Number(filters.maxPrice) : priceBounds.max)}
                    </span>
                  </div>
                  <div className="grid gap-1">
                    <label className="sr-only" htmlFor="lookbook-price-min">Minimum price</label>
                    <input
                      id="lookbook-price-min"
                      type="range"
                      min={priceBounds.min}
                      max={priceBounds.max}
                      step="500"
                      value={filters.minPrice || priceBounds.min}
                      onChange={(event) => setPriceBound("minPrice", Number(event.target.value))}
                      className="h-4 w-full cursor-pointer accent-primary"
                    />
                    <label className="sr-only" htmlFor="lookbook-price-max">Maximum price</label>
                    <input
                      id="lookbook-price-max"
                      type="range"
                      min={priceBounds.min}
                      max={priceBounds.max}
                      step="500"
                      value={filters.maxPrice || priceBounds.max}
                      onChange={(event) => setPriceBound("maxPrice", Number(event.target.value))}
                      className="h-4 w-full cursor-pointer accent-primary"
                    />
                  </div>
                </div>
                <button type="submit" className="flex min-h-10 items-center justify-center gap-2 whitespace-nowrap rounded-sm bg-primary px-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-maroon-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:col-span-2 lg:col-span-1">
                  <SlidersHorizontal size={14} /> Apply filters
                </button>
                <button type="button" onClick={clearAllFilters} className="min-h-10 text-[10px] font-semibold uppercase tracking-wider text-primary underline decoration-gold/60 underline-offset-4 hover:text-gold-deep sm:col-span-2 lg:col-span-1">
                  Clear all
                </button>
              </div>
            </form>

            {filteredLooks.length ? (
              <div className="grid min-w-0 lg:min-h-[58svh] lg:grid-cols-[minmax(0,6fr)_minmax(340px,4fr)]">
                <section
                  aria-label="Saree product carousel"
                  aria-roledescription="carousel"
                  tabIndex={0}
                  onKeyDown={handleCarouselKeyDown}
                  className="min-w-0 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold"
                >
                  <div className="relative flex min-h-[62svh] flex-col overflow-hidden bg-[radial-gradient(ellipse_at_50%_45%,#fffaf2_0%,#f3e5d5_72%,#ead8c3_100%)] sm:min-h-[68svh] lg:min-h-[58svh]">
                    <div className="pointer-events-none absolute inset-3 border border-gold/25 sm:inset-5" aria-hidden="true" />
                    <div className="pointer-events-none absolute left-1/2 top-1/2 h-[70vw] w-[70vw] max-h-[620px] max-w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/20" aria-hidden="true" />
                    <div className="pointer-events-none absolute left-1/2 top-3 z-20 hidden -translate-x-1/2 items-center gap-2 text-gold-deep sm:flex" aria-hidden="true">
                      <span className="h-px w-14 bg-gradient-to-r from-transparent to-gold" />
                      <Flower2 size={18} strokeWidth={1.3} />
                      <span className="h-px w-14 bg-gradient-to-l from-transparent to-gold" />
                    </div>
                    <div className="relative min-h-0 flex-1" aria-live="polite">
                      {visibleCarouselSlides.map(({ product, index, offset, active, distance }) => (
                          <motion.div
                            key={product.id}
                            role="group"
                            aria-roledescription="slide"
                            tabIndex={active || distance === 1 ? 0 : -1}
                            drag={active ? "x" : false}
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.14}
                            onDragEnd={(_, info) => {
                              if (info.offset.x < -55 || info.velocity.x < -550) selectAt(selectedIndex + 1);
                              else if (info.offset.x > 55 || info.velocity.x > 550) selectAt(selectedIndex - 1);
                            }}
                            onClick={() => setSelectedProductId(product.id)}
                            onKeyDown={(event) => {
                              if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                setSelectedProductId(product.id);
                              }
                            }}
                            animate={{
                              x: `${offset * 73}%`,
                              scale: active ? 1 : 0.86,
                              opacity: active ? 1 : 0.68,
                              filter: active ? "blur(0px)" : "blur(0.5px)",
                              zIndex: active ? 10 : 5 - distance,
                            }}
                            transition={{ duration: reduceMotion ? 0 : 0.52, ease: [0.22, 1, 0.36, 1] }}
                            aria-label={`Show look ${index + 1}: ${product.name}`}
                            aria-current={active ? "true" : undefined}
                            className={`absolute left-1/2 top-1/2 flex h-[76%] w-[78%] -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden bg-background/70 p-1.5 shadow-[0_24px_70px_-35px_rgba(54,18,24,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:h-[80%] sm:w-[65%] lg:h-[78%] lg:w-[64%] ${active ? "border-[3px] border-gold shadow-[0_28px_70px_-32px_rgba(94,57,15,0.55)]" : "border border-gold/50"}`}
                          >
                            <img src={product.image} alt={active ? `${product.name} — product photograph` : ""} className="h-full w-full select-none object-cover" draggable="false" loading={active ? "eager" : "lazy"} />
                            {(product.isFeatured || product.featured) && active && (
                              <span className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-gold px-3 py-1.5 text-[9px] font-semibold uppercase tracking-wider text-maroon-deep shadow-sm">
                                <Crown size={12} /> Featured look
                              </span>
                            )}
                            {active && (
                              <span className="pointer-events-auto absolute right-3 top-3">
                                <button
                                  type="button"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    setExpandedLook(true);
                                  }}
                                  onPointerDown={(event) => event.stopPropagation()}
                                  onKeyDown={(event) => event.stopPropagation()}
                                  aria-label="Expand selected saree image"
                                  className="flex h-10 w-10 items-center justify-center rounded-full bg-background/95 text-primary shadow transition-colors hover:bg-white"
                                >
                                  <Maximize2 size={17} />
                                </button>
                              </span>
                            )}
                            <span className="pointer-events-none absolute inset-x-1.5 bottom-1.5 bg-gradient-to-t from-maroon-deep/85 to-transparent px-4 pb-4 pt-12 text-left text-white sm:px-5">
                              <span className="block text-[9px] uppercase tracking-[0.18em] text-gold">{product.category || "Saree"}</span>
                              <span className="mt-1 block font-serif text-xl leading-tight sm:text-2xl">{product.name}</span>
                            </span>
                          </motion.div>
                      ))}
                    </div>
                    <div className="absolute inset-x-3 top-1/2 z-20 flex -translate-y-1/2 items-center justify-between sm:inset-x-5">
                        <button type="button" onClick={() => selectAt(selectedIndex - 1)} aria-label="Previous look" className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/45 bg-background/95 text-primary shadow-lg transition-colors hover:bg-primary hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary motion-reduce:transition-none sm:h-12 sm:w-12">
                          <ArrowLeft size={17} />
                        </button>
                        <button type="button" onClick={() => selectAt(selectedIndex + 1)} aria-label="Next look" className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/45 bg-background/95 text-primary shadow-lg transition-colors hover:bg-primary hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary motion-reduce:transition-none sm:h-12 sm:w-12">
                          <ArrowRight size={17} />
                        </button>
                    </div>
                    <div className="relative z-20 flex items-center justify-center px-7 pb-6 pt-3 sm:px-10">
                      <div className="flex items-center gap-2" aria-label="Look progress">
                        {Array.from({ length: Math.min(filteredLooks.length, 5) }, (_, index) => {
                          const currentGroup = Math.floor(selectedIndex / 5);
                          return (
                            <span
                              key={index}
                              className={`h-1 w-9 rounded-full transition-colors ${index === selectedIndex % 5 ? "bg-primary" : "bg-gold/35"}`}
                              aria-hidden="true"
                            >
                              {currentGroup > 0 && index === selectedIndex % 5 ? <span className="sr-only">Set {currentGroup + 1}</span> : null}
                            </span>
                          );
                        })}
                      </div>
                      <div className="min-w-28 text-right">
                        <p className="font-serif text-base text-primary" aria-label={`Look ${selectedIndex + 1} of ${filteredLooks.length}`}>
                          {String(selectedIndex + 1).padStart(2, "0")}<span className="mx-1 text-gold-deep">/</span>{String(filteredLooks.length).padStart(2, "0")}
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
                {selectedProduct && (
                  <aside id="lookbook-piece-details" className="hidden min-w-0 bg-[linear-gradient(145deg,#fffaf4,#fff7ed)] p-5 lg:block xl:p-7">
                    <div className="sticky top-24 rounded-2xl border border-gold/30 bg-white/45 p-5 shadow-[0_22px_55px_-42px_rgba(94,57,15,0.65)] xl:p-7">
                      <ProductDetails
                        product={selectedProduct}
                        bundleProducts={bundleProducts}
                        index={selectedIndex}
                        total={filteredLooks.length}
                        wishlistIds={wishlistIds}
                        cart={cart}
                        isAdding={isAdding}
                        selectedQuantity={selectedQuantity}
                        onAddProduct={(item) => addProductsToCart([item])}
                        onAddLook={() => addProductsToCart(bundleProducts, { [selectedProduct.id]: selectedQuantity })}
                        onSaveLook={saveCurrentLook}
                        onToggleWishlist={toggleWishlist}
                        onRemoveOptional={clearOptionalPiece}
                        onQuantityChange={setSelectedQuantity}
                      />
                    </div>
                  </aside>
                )}
              </div>
            ) : (
              <div className="mx-auto my-6 flex max-w-2xl flex-col items-center gap-3 border-y border-gold/25 px-6 py-12 text-center" role="status">
                <Search size={20} className="text-gold-deep" />
                <h2 className="font-serif text-2xl text-primary">No sarees match these filters.</h2>
                <p className="text-sm text-muted-foreground">Try a different occasion, color, type or price range.</p>
                <button type="button" onClick={clearAllFilters} className="mt-2 text-[10px] font-semibold uppercase tracking-widest text-primary">Clear filters</button>
              </div>
            )}
          </section>

          {selectedProduct && isCarouselVisible && (
            <div className={`fixed inset-x-0 bottom-16 z-40 px-4 transition-opacity motion-reduce:transition-none md:bottom-16 lg:hidden ${mobileDetailsOpen ? "pointer-events-none opacity-0" : "opacity-100"}`}>
              <button ref={mobileDetailsTriggerRef} type="button" onClick={() => setMobileDetailsOpen(true)} aria-expanded={mobileDetailsOpen} aria-controls="mobile-lookbook-piece-details" disabled={mobileDetailsOpen} className="mx-auto flex min-h-12 w-full max-w-lg items-center justify-between border border-gold/50 bg-background/95 px-5 text-xs font-semibold uppercase tracking-[0.13em] text-primary shadow-lg backdrop-blur disabled:opacity-0">
                Selected look · {formatPrice(Number(selectedProduct.price))}
                <ShoppingBag size={16} />
              </button>
            </div>
          )}

          <section id="mix-match" className="scroll-mt-24 border-y border-gold/25 bg-[#fbf6ef] px-4 py-12 sm:px-7 sm:py-16 lg:px-10">
            <div className="mx-auto max-w-[1320px]">
              <header className="mb-9 text-center">
                <Flower2 size={22} strokeWidth={1.3} className="mx-auto mb-2 text-gold-deep" aria-hidden="true" />
                <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.22em] text-gold-deep">Curate your own ensemble</p>
                <h2 className="font-serif text-3xl text-primary sm:text-4xl">Mix & Match Studio</h2>
                <p className="mx-auto mt-3 max-w-xl text-xs leading-5 text-muted-foreground sm:text-sm">
                  Pair pieces from our live catalogue. Your selection and prices update as you build your look.
                </p>
              </header>

              <div className="grid gap-7 lg:grid-cols-[minmax(260px,0.78fr)_minmax(0,1.42fr)] lg:gap-10">
                <aside className="min-w-0">
                  <div className="relative mx-auto max-w-[400px] overflow-hidden border border-gold/35 bg-[#eee1d1] p-2 shadow-[0_22px_55px_-35px_rgba(54,18,24,0.52)]">
                    <div className="pointer-events-none absolute inset-3 z-10 border border-white/65" aria-hidden="true" />
                    {selectedProduct ? (
                      <div className="relative aspect-[0.78/1] overflow-hidden [border-radius:48%_48%_0_0] bg-secondary">
                        <img src={selectedProduct.image} alt={`${selectedProduct.name} product photograph`} className="h-full w-full object-cover" loading="lazy" />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-maroon-deep/90 via-maroon-deep/35 to-transparent px-5 pb-5 pt-20 text-white">
                          <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-gold">Your selected saree</span>
                          <h3 className="mt-1 font-serif text-lg leading-tight sm:text-xl">{selectedProduct.name}</h3>
                          <p className="mt-1 text-xs text-white/85">{formatPrice(Number(selectedProduct.price))}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex aspect-[0.78/1] flex-col items-center justify-center bg-secondary px-8 text-center">
                        <Shirt size={28} className="mb-3 text-gold-deep" aria-hidden="true" />
                        <p className="font-serif text-xl text-primary">Choose your saree</p>
                        <p className="mt-2 text-xs leading-5 text-muted-foreground">Select a piece from the live catalogue to begin your look.</p>
                      </div>
                    )}
                  </div>
                  <div className="mx-auto mt-4 flex max-w-[400px] gap-2 overflow-x-auto pb-1" aria-label="Choose a saree">
                    {sareeProducts.slice(0, 5).map((product) => (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => selectMixProduct("saree", product)}
                        aria-label={`Select ${product.name}`}
                        aria-pressed={selectedProduct?.id === product.id}
                        className={`h-[68px] w-[56px] shrink-0 overflow-hidden border-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${selectedProduct?.id === product.id ? "border-primary" : "border-transparent hover:border-gold"}`}
                      >
                        <img src={product.image} alt="" className="h-full w-full object-cover" loading="lazy" />
                      </button>
                    ))}
                    <div className="ml-auto hidden min-w-0 flex-1 items-center justify-end text-right text-[9px] uppercase leading-4 tracking-[0.12em] text-muted-foreground sm:flex">
                      Live catalogue<br />product imagery
                    </div>
                  </div>
                  <p className="mt-3 text-center text-[10px] leading-4 text-muted-foreground">
                    Preview uses the selected product photo; it does not composite pieces onto a model.
                  </p>
                </aside>

                <div className="min-w-0">
                  <div className="grid grid-cols-4 border-b border-gold/35" role="tablist" aria-label="Choose a product category">
                    {mixCategories.map((category) => {
                      const Icon = category.icon;
                      const isActive = activeMixCategory === category.id;
                      return (
                        <button
                          key={category.id}
                          type="button"
                          role="tab"
                          id={`mix-tab-${category.id}`}
                          aria-selected={isActive}
                          aria-controls="mix-category-products"
                          disabled={!category.products.length}
                          onClick={() => setActiveMixCategory(category.id)}
                          className={`relative flex min-h-[68px] flex-col items-center justify-center gap-1 px-1 text-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-45 sm:min-h-[76px] ${isActive ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
                        >
                          <Icon size={18} strokeWidth={1.5} aria-hidden="true" />
                          <span className="text-[8px] font-semibold uppercase tracking-[0.1em] sm:text-[9px] sm:tracking-[0.14em]">{category.label}</span>
                          <span className="text-[8px] text-muted-foreground">{category.products.length}</span>
                          {isActive && <span className="absolute inset-x-2 -bottom-px h-[2px] bg-gold-deep" aria-hidden="true" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mb-3 mt-5 flex min-h-8 items-center justify-between gap-3">
                    <div>
                      <h3 className="font-serif text-lg text-primary">{activeMixTab?.label || "Choose a piece"}</h3>
                      <p className="text-[10px] text-muted-foreground">Select a product to add it to your look</p>
                    </div>
                    {activeMixProducts.length > 3 && (
                      <div className="flex gap-1">
                        <button type="button" onClick={() => scrollMixProducts(-1)} aria-label="Previous products" className="flex h-8 w-8 items-center justify-center border border-gold/35 text-primary hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
                          <ArrowLeft size={14} />
                        </button>
                        <button type="button" onClick={() => scrollMixProducts(1)} aria-label="Next products" className="flex h-8 w-8 items-center justify-center border border-gold/35 text-primary hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    )}
                  </div>

                  <div
                    id="mix-category-products"
                    role="tabpanel"
                    aria-labelledby={`mix-tab-${activeMixTab?.id || "saree"}`}
                    className="min-w-0"
                  >
                    {activeMixProducts.length ? (
                      <div ref={mixProductsRef} className="grid auto-cols-[44%] grid-flow-col gap-3 overflow-x-auto overscroll-x-contain pb-3 [scrollbar-width:thin] sm:auto-cols-[30%] lg:auto-cols-[23%]">
                        {activeMixProducts.map((product) => (
                          <MixMatchProductCard
                            key={product.id}
                            product={product}
                            selected={activeMixTab.selectedId === product.id}
                            onSelect={(item) => selectMixProduct(activeMixTab.id, item)}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="flex min-h-[180px] flex-col items-center justify-center border border-dashed border-gold/35 bg-white/40 px-6 text-center">
                        <Sparkles size={20} className="mb-2 text-gold-deep" aria-hidden="true" />
                        <p className="font-serif text-lg text-primary">No {activeMixTab?.label.toLowerCase()} options yet</p>
                        <p className="mt-1 max-w-xs text-xs leading-5 text-muted-foreground">Products added to the catalogue will appear here automatically.</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-5 border border-gold/30 bg-white/75 p-4 sm:p-5">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-gold-deep">Your Look</p>
                        <h3 className="mt-1 font-serif text-xl text-primary">Complete outfit</h3>
                      </div>
                      <span className="text-[10px] text-muted-foreground">{bundleProducts.length} {bundleProducts.length === 1 ? "piece" : "pieces"}</span>
                    </div>
                    {bundleProducts.length ? (
                      <div className="divide-y divide-gold/15">
                        {bundleProducts.map((product) => {
                          const typeLabel = isSareeProduct(product) ? "Saree" : isBlouseProduct(product) ? "Blouse" : isJewelleryProduct(product) ? "Jewellery" : "Accessory";
                          const isOptional = !isSareeProduct(product);
                          return (
                            <div key={product.id} className="flex items-center gap-3 py-2.5">
                              <img src={product.image} alt="" className="h-12 w-10 shrink-0 object-cover" loading="lazy" />
                              <div className="min-w-0 flex-1">
                                <p className="text-[8px] uppercase tracking-[0.13em] text-muted-foreground">{typeLabel}</p>
                                <p className="truncate font-serif text-sm text-primary">{product.name}</p>
                                {!canAddProduct(product) && <p className="text-[9px] text-maroon-deep">Currently unavailable</p>}
                              </div>
                              <span className="whitespace-nowrap text-xs text-primary">{formatPrice(Number(product.price))}</span>
                              {isOptional && (
                                <button type="button" onClick={() => clearOptionalPiece(product.id)} aria-label={`Remove ${product.name} from this look`} className="flex h-8 w-8 shrink-0 items-center justify-center text-muted-foreground hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
                                  <X size={14} />
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="border-y border-gold/15 py-4 text-xs text-muted-foreground">Choose a saree to start building your look.</p>
                    )}
                    <div className="mt-3 flex items-end justify-between border-t border-gold/25 pt-3">
                      <div>
                        <p className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">Available total</p>
                        <p className="mt-1 text-[9px] text-muted-foreground">Live catalogue prices · no bundle discount</p>
                      </div>
                      <p className="font-serif text-2xl text-primary">{formatPrice(mixMatchTotal)}</p>
                    </div>
                    {bundleProducts.length !== purchasableBundleProducts.length && (
                      <p className="mt-2 text-[10px] text-maroon-deep">Unavailable pieces are excluded from the total and will not be added.</p>
                    )}
                    <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto]">
                      <button type="button" onClick={() => addProductsToCart(bundleProducts)} disabled={!purchasableBundleProducts.length || isAdding} className="inline-flex min-h-11 items-center justify-center gap-2 bg-primary px-4 text-[10px] font-semibold uppercase tracking-[0.13em] text-white transition-colors hover:bg-maroon-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-40">
                        {isAdding ? <LoaderCircle size={15} className="animate-spin" /> : <ShoppingBag size={15} />}
                        {isAdding ? "Adding your look…" : "Add complete look to cart"}
                      </button>
                      <button type="button" onClick={saveCurrentLook} disabled={!bundleProducts.length} className="inline-flex min-h-11 items-center justify-center gap-2 border border-gold/50 px-4 text-[10px] font-semibold uppercase tracking-[0.13em] text-primary transition-colors hover:bg-secondary disabled:opacity-40">
                        <Bookmark size={15} /> Save look
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 grid gap-8 border-t border-gold/25 pt-7 lg:grid-cols-2 lg:gap-12">
                <div>
                  <h3 className="mb-4 font-serif text-2xl text-primary">Your saved looks</h3>
                  {savedLookDetails.length ? (
                    <div className="space-y-3">
                      {savedLookDetails.map((look) => (
                        <div key={look.id} className="flex items-center gap-3 border-b border-gold/20 pb-3">
                          <div className="flex min-w-0 flex-1 items-center gap-3">
                            {look.products[0]?.image && <img src={look.products[0].image} alt="" className="h-12 w-10 shrink-0 object-cover" loading="lazy" />}
                            <div className="min-w-0">
                              <p className="truncate font-serif text-sm text-primary">{look.title}</p>
                              <p className="text-[10px] text-muted-foreground">{look.products.length} saved catalogue {look.products.length === 1 ? "piece" : "pieces"}</p>
                            </div>
                          </div>
                          <button type="button" onClick={() => loadSavedLook(look)} className="text-[9px] font-semibold uppercase tracking-widest text-primary">Load</button>
                          <button type="button" onClick={() => removeSavedLook(look.id)} aria-label={`Delete saved look ${look.title}`} className="p-2 text-muted-foreground hover:text-destructive"><X size={15} /></button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Save a combination to find it here later.</p>
                  )}
                </div>
                <div className="border-t border-gold/20 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                  <h3 className="mb-3 font-serif text-xl text-primary">Wishlist <span className="text-sm text-muted-foreground">({mobileWishlistProducts.length})</span></h3>
                  {mobileWishlistProducts.length ? (
                    <div className="flex flex-wrap gap-2">
                      {mobileWishlistProducts.map((item) => (
                        <Link key={item.id} to={`/product/${item.id}`} className="flex items-center gap-2 border border-gold/25 px-2 py-1.5 text-xs text-primary hover:border-gold">
                          <Heart size={12} className="fill-current" />{item.name}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Use the heart beside a piece to save it on this device.</p>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section id="shop-by-occasion" className="relative scroll-mt-24 overflow-hidden bg-[#fff9f2] px-4 py-14 sm:px-7 sm:py-16 lg:px-10">
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
              <div className="absolute -left-7 -top-8 rotate-[-24deg] text-gold/20"><Flower2 size={150} strokeWidth={0.7} /></div>
              <div className="absolute -right-7 -top-8 rotate-[24deg] text-gold/20"><Flower2 size={150} strokeWidth={0.7} /></div>
            </div>
            <div className="relative mx-auto max-w-[1320px]">
              <header className="mb-7 text-center">
                <div className="mb-2 flex items-center justify-center gap-3 text-gold-deep" aria-hidden="true">
                  <span className="h-px w-12 bg-gold/70 sm:w-20" />
                  <Flower2 size={23} strokeWidth={1.3} />
                  <span className="h-px w-12 bg-gold/70 sm:w-20" />
                </div>
                <h2 className="font-serif text-3xl text-primary sm:text-4xl lg:text-5xl">Lookbook by Occasion</h2>
                <p className="mt-2 text-sm text-muted-foreground sm:text-base">Curated looks for every special moment</p>
              </header>

              {occasionShowcases.length ? (
                <>
                  <nav aria-label="Lookbook occasions" className="mb-8 flex gap-2 overflow-x-auto pb-2 sm:justify-center sm:gap-3">
                    {occasionShowcases.map((group) => {
                      const Icon = group.id === "wedding" ? Crown
                        : group.id === "festive" || group.id === "party" ? Sparkles
                          : group.id === "reception" ? Gem
                            : group.id === "office" || group.id === "everyday" ? ShoppingBag
                              : Flower2;
                      const active = activeOccasionGroup?.id === group.id;
                      return (
                        <button
                          key={group.id}
                          type="button"
                          aria-pressed={active}
                          onClick={() => selectOccasionGroup(group.id)}
                          className={`flex min-h-12 shrink-0 items-center gap-2 rounded-lg border px-4 text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:px-5 sm:text-sm ${active ? "border-primary bg-primary text-white" : "border-gold/30 bg-white/65 text-primary hover:border-gold hover:bg-white"}`}
                        >
                          <Icon size={18} strokeWidth={1.5} aria-hidden="true" />
                          {group.label}
                          <span className={`text-[10px] ${active ? "text-white/75" : "text-muted-foreground"}`}>{group.products.length}</span>
                        </button>
                      );
                    })}
                  </nav>

                  {activeOccasionGroup && (
                    <>
                      <div className="relative px-8 sm:px-10">
                        {activeOccasionGroup.products.length > 1 && (
                          <>
                            <button
                              type="button"
                              onClick={() => scrollOccasionCarousel(-1)}
                              aria-label="Previous occasion looks"
                              className="absolute left-0 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gold/40 bg-white text-primary shadow-md transition-colors hover:bg-primary hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary sm:h-12 sm:w-12"
                            >
                              <ArrowLeft size={18} />
                            </button>
                            <button
                              type="button"
                              onClick={() => scrollOccasionCarousel(1)}
                              aria-label="Next occasion looks"
                              className="absolute right-0 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gold/40 bg-white text-primary shadow-md transition-colors hover:bg-primary hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary sm:h-12 sm:w-12"
                            >
                              <ArrowRight size={18} />
                            </button>
                          </>
                        )}
                        <div
                          ref={occasionCarouselRef}
                          onScroll={(event) => {
                            const element = event.currentTarget;
                            const maxScroll = element.scrollWidth - element.clientWidth;
                            setOccasionScrollProgress(maxScroll > 0 ? element.scrollLeft / maxScroll : 0);
                          }}
                          className="grid auto-cols-[82%] grid-flow-col gap-3 overflow-x-auto overscroll-x-contain pb-3 [scrollbar-width:thin] [scroll-snap-type:x_mandatory] sm:auto-cols-[46%] sm:gap-4 lg:auto-cols-[calc((100%-3rem)/4)]"
                        >
                          {activeOccasionGroup.products.map((product) => (
                            <Link
                              key={product.id}
                              to={`/product/${product.id}`}
                              className="group relative aspect-[0.72/1] min-w-0 overflow-hidden rounded-[26px] border-[3px] border-gold/75 bg-maroon-deep shadow-[0_20px_50px_-32px_rgba(54,18,24,0.65)] [scroll-snap-align:start] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                            >
                              <img
                                src={product.image}
                                alt={product.name}
                                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none"
                                loading="lazy"
                              />
                              <span className="absolute left-3 top-3 max-w-[75%] truncate rounded-full bg-background/90 px-3 py-1 text-[8px] font-semibold uppercase tracking-[0.12em] text-primary sm:text-[9px]">
                                {product.category || activeOccasionGroup.label}
                              </span>
                              {!isAvailable(product) && (
                                <span className="absolute right-3 top-3 rounded-full bg-maroon-deep/90 px-3 py-1 text-[8px] font-semibold uppercase tracking-wider text-white">Out of stock</span>
                              )}
                              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-maroon-deep via-maroon-deep/90 to-transparent px-4 pb-4 pt-20 text-left text-white sm:px-5 sm:pb-5">
                                <span className="block text-[9px] font-semibold uppercase tracking-[0.15em] text-gold">{activeOccasionGroup.label} Collection</span>
                                <span className="mt-1 line-clamp-2 block font-serif text-lg leading-tight sm:text-xl">{product.name}</span>
                                <span className="mt-1 line-clamp-2 block text-[10px] leading-4 text-white/85 sm:text-xs">
                                  {product.description || product.category || activeOccasionGroup.label}
                                </span>
                                <span className="mt-3 flex items-center justify-between border-t border-white/25 pt-2.5">
                                  <span className="font-medium text-sm">{formatPrice(Number(product.price))}</span>
                                  <span className="inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-gold">
                                    Explore look <ArrowRight size={13} />
                                  </span>
                                </span>
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                      {activeOccasionGroup.products.length > 1 && (
                        <div className="mt-5 flex items-center justify-center gap-2" aria-label="Occasion look carousel position">
                          {Array.from({ length: Math.min(4, activeOccasionGroup.products.length) }, (_, index) => {
                            const activeProgress = Math.round(occasionScrollProgress * (Math.min(4, activeOccasionGroup.products.length) - 1));
                            return (
                              <span
                                key={index}
                                className={`h-1 w-12 rounded-full transition-colors ${index === activeProgress ? "bg-primary" : "bg-gold/35"}`}
                                aria-hidden="true"
                              />
                            );
                          })}
                        </div>
                      )}
                    </>
                  )}
                  <p className="mt-5 text-center text-[10px] text-muted-foreground">Products, images, descriptions, prices, and availability are from the live catalogue.</p>
                </>
              ) : (
                <div className="mx-auto max-w-xl border border-dashed border-gold/40 bg-white/60 px-6 py-12 text-center">
                  <Flower2 size={25} className="mx-auto mb-3 text-gold-deep" aria-hidden="true" />
                  <p className="font-serif text-xl text-primary">Occasion edits are taking shape</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">Add an occasion to products in the catalogue to feature them here.</p>
                </div>
              )}
            </div>
          </section>

          <section id="saree-showcase" className="scroll-mt-24 bg-maroon-deep px-5 py-12 text-white sm:px-8 lg:px-12">
            <div className="mx-auto grid max-w-[1320px] gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div>
                <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-gold">Interactive product view</p>
                <h2 className="font-serif text-3xl sm:text-4xl">Saree Showcase</h2>
                <p className="mt-4 max-w-xl text-sm leading-6 text-white/75">
                  Zoom the current product photography and compare available gallery images. This catalogue contains 2D photographs, not 3D models or 360° assets.
                </p>
                {selectedProduct && <p className="mt-4 font-serif text-lg text-gold">{selectedProduct.name}</p>}
              </div>
              {selectedProduct && (
                <div className="min-w-0">
                  <div className="relative h-[min(70svh,560px)] overflow-hidden border border-gold/40 bg-black/10">
                    <img
                      src={previewImage}
                      alt={`${selectedProduct.name} product photograph`}
                      className="h-full w-full object-contain transition-transform duration-300 motion-reduce:transition-none"
                      style={{ transform: `scale(${showcaseZoom})` }}
                    />
                    <div className="absolute bottom-3 right-3 flex items-center gap-2">
                      <button type="button" onClick={() => setShowcaseZoom((zoom) => Math.max(1, Number((zoom - 0.25).toFixed(2))))} aria-label="Zoom out" disabled={showcaseZoom <= 1} className="flex h-10 w-10 items-center justify-center bg-background text-primary disabled:opacity-40"><Minus size={17} /></button>
                      <button type="button" onClick={() => setShowcaseZoom((zoom) => Math.min(2.5, Number((zoom + 0.25).toFixed(2))))} aria-label="Zoom in" disabled={showcaseZoom >= 2.5} className="flex h-10 w-10 items-center justify-center bg-background text-primary disabled:opacity-40"><Plus size={17} /></button>
                      <button type="button" onClick={() => setShowcaseZoom(1)} className="h-10 bg-background px-3 text-[9px] font-semibold uppercase tracking-widest text-primary">Reset</button>
                    </div>
                  </div>
                  {previewImages.length > 1 && (
                    <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
                      {previewImages.map((image, index) => (
                        <button key={`${image}-${index}`} type="button" onClick={() => { setShowcaseImage(image); setShowcaseZoom(1); }} aria-label={`Show product image ${index + 1}`} aria-pressed={showcaseImage === image} className={`h-16 w-12 shrink-0 overflow-hidden border ${showcaseImage === image ? "border-gold" : "border-white/25"}`}>
                          <img src={image} alt="" className="h-full w-full object-cover" loading="lazy" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          <section id="personal-style-finder" className="scroll-mt-24 px-5 py-12 sm:px-8 lg:px-12">
            <div className="mx-auto max-w-[1320px] border border-gold/30 bg-secondary/30 p-6 sm:p-9">
              <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-gold-deep">A considered edit</p>
              <h2 className="font-serif text-3xl text-primary sm:text-4xl">Personal Style Finder</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                Choose from attributes on current products. Your choices filter the Lookbook; they do not generate or alter product imagery.
              </p>
              <form onSubmit={applyStyleFinder} className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <FilterSelect id="finder-occasion" label="Occasion" value={finder.occasion} options={occasionOptions} onChange={(value) => setFinder((current) => ({ ...current, occasion: value }))} />
                <FilterSelect id="finder-color" label="Color" value={finder.color} options={colorOptions} onChange={(value) => setFinder((current) => ({ ...current, color: value }))} />
                <label htmlFor="finder-budget" className="block">
                  <span className="mb-1.5 block text-[9px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Maximum price</span>
                  <select id="finder-budget" value={finder.maxPrice} onChange={(event) => setFinder((current) => ({ ...current, maxPrice: event.target.value }))} className="w-full border-b border-gold/40 bg-transparent py-2 text-sm text-primary outline-none focus:border-primary">
                    <option value="">Any price</option>
                    {priceOptions.map((price) => <option key={price} value={String(price)}>{formatPrice(price)} or less</option>)}
                  </select>
                </label>
                <div className="flex items-end">
                  <button type="submit" className="flex min-h-11 w-full items-center justify-center gap-2 bg-primary px-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white hover:bg-maroon-deep">
                    Find my edit <Search size={14} />
                  </button>
                </div>
              </form>
            </div>
          </section>
        </>
      )}

      {mobileDetailsOpen && selectedProduct && (
        <AnimatePresence>
          <motion.button key="mobile-lookbook-details-overlay" type="button" aria-label="Close selected look details" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileDetailsOpen(false)} className="fixed inset-x-0 top-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-[60] bg-maroon-deep/30 lg:hidden" />
          <motion.aside
            key="mobile-lookbook-details-sheet"
            ref={mobileDetailsDialogRef}
            id="mobile-lookbook-piece-details"
            role="dialog"
            aria-modal="true"
            aria-label="Selected look and product details"
            initial={{ y: reduceMotion ? 0 : "100%" }}
            animate={{ y: 0 }}
            exit={{ y: reduceMotion ? 0 : "100%" }}
            transition={{ duration: reduceMotion ? 0 : 0.24, ease: "easeOut" }}
            className="fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-[65] max-h-[76svh] overflow-y-auto rounded-t-xl border-t border-gold/40 bg-background px-6 pb-6 pt-3 shadow-[0_-16px_50px_-28px_rgba(54,18,24,0.5)] lg:hidden"
          >
            <div className="sticky top-0 mb-5 flex items-center justify-between border-b border-gold/25 bg-background pb-3 pt-1">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-deep">Selected look</span>
              <button ref={mobileDetailsCloseRef} type="button" onClick={() => setMobileDetailsOpen(false)} className="px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">Close</button>
            </div>
            <ProductDetails
              product={selectedProduct}
              bundleProducts={bundleProducts}
              index={selectedIndex}
              total={filteredLooks.length}
              wishlistIds={wishlistIds}
              cart={cart}
              isAdding={isAdding}
              selectedQuantity={selectedQuantity}
              onAddProduct={(item) => addProductsToCart([item])}
              onAddLook={() => addProductsToCart(bundleProducts, { [selectedProduct.id]: selectedQuantity })}
              onSaveLook={saveCurrentLook}
              onToggleWishlist={toggleWishlist}
              onRemoveOptional={clearOptionalPiece}
              onQuantityChange={setSelectedQuantity}
            />
          </motion.aside>
        </AnimatePresence>
      )}
      <AnimatePresence>
        {expandedLook && selectedProduct && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedProduct.name} enlarged product image`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-maroon-deep/95 p-4 sm:p-8"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setExpandedLook(false);
            }}
          >
            <button
              ref={expandedLookCloseRef}
              type="button"
              onClick={() => setExpandedLook(false)}
              aria-label="Close enlarged image"
              className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-background text-primary"
            >
              <X size={20} />
            </button>
            <div className="flex max-h-full max-w-6xl flex-col items-center">
              <img src={selectedProduct.image} alt={`${selectedProduct.name} product photograph`} className="max-h-[78svh] max-w-full object-contain" />
              <p className="mt-4 font-serif text-xl text-white">{selectedProduct.name}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
