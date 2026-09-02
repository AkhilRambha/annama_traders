import React, { createContext, useContext, useState, useEffect } from "react";
import { PRODUCTS, CATEGORIES } from "@/data/products";
import { ALL_DRESS_PRODUCTS } from "@/data/dressProducts";

// Default Hero Images (using imported static assets temporarily)
import bridal from "@/assets/sarees/pt5.jfif";
import designer from "@/assets/sarees/kalm3.jfif";
import silk from "@/assets/sarees/silk.jfif";

const defaultHeroImages = [bridal, designer, silk];

const defaultReviews = [
  {
    id: 1,
    name: "Sruthi Reddy",
    location: "Banjara Hills, Hyderabad",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1583391733958-d259779e5595?w=500&h=700&fit=crop",
    content: "The home trial experience was completely stress-free. The Kanchi pattu I bought for my wedding is absolutely breathtaking. Highly recommend Alankrita to every bride!",
    rating: 5,
  },
  {
    id: 2,
    name: "Ananya Rao",
    location: "Jubilee Hills, Hyderabad",
    type: "photo",
    thumbnail: "https://images.unsplash.com/photo-1610030469983-98e550d615ef?w=500&h=500&fit=crop",
    content: "Beautiful collection of Kalamkari sarees. The texture is pure and the colors are completely natural. I get compliments every time I wear it.",
    rating: 5,
  },
  {
    id: 3,
    name: "Kavya Menon",
    location: "Gachibowli, Hyderabad",
    type: "text",
    content: "I was skeptical about buying expensive silk online, but the WhatsApp ordering was so smooth. They sent me videos of the saree before shipping. Excellent service.",
    rating: 5,
  },
  {
    id: 4,
    name: "Priya Desai",
    location: "Madhapur, Hyderabad",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&h=700&fit=crop",
    content: "The Banarasi tissue saree is stunning in person. Thank you for making my anniversary special!",
    rating: 5,
  },
  {
    id: 5,
    name: "Meera Krishnan",
    location: "Secunderabad",
    type: "photo",
    thumbnail: "https://images.unsplash.com/photo-1619855562852-c651fc85cbdf?w=500&h=500&fit=crop",
    content: "I requested a home trial for my mother. The curator was so patient and brought amazing options.",
    rating: 4,
  },
  {
    id: 6,
    name: "Lakshmi Sharma",
    location: "Kondapur, Hyderabad",
    type: "text",
    content: "Bought 5 sarees for my daughter's wedding trousseau. Unmatched quality and very reasonable pricing compared to big showrooms.",
    rating: 5,
  }
];

const defaultContactInfo = {
  phone: "+91 86886 32684",
  email: "annammatraders98@gmail.com",
  address: "Nagole, Hyderabad, Telangana",
  hours: "Mon Ã¢â‚¬â€œ Sat Ã‚Â· 9:00 AM to 9:00 PM"
};

const defaultLegalPages = {
  privacy: "This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from Alankrita.\n\nWe collect Device Information using technologies such as cookies and log files. We use this to screen for potential risk and fraud, and to improve and optimize our Site.",
  terms: "By visiting our site and/ or purchasing something from us, you engage in our Service and agree to be bound by the following terms and conditions. These Terms of Service apply to all users of the site.\n\nWe reserve the right to refuse service to anyone for any reason at any time."
};

const defaultOffers = [
  {
    id: "offer-1",
    title: "Bridal Trousseau Bundle",
    description: "Purchase any Bridal Saree and get 50% off on a Kundan Jewellery Set.",
    image: "https://images.unsplash.com/photo-1583391733958-d259779e5515?q=80&w=800&auto=format&fit=crop",
    isActive: true
  },
  {
    id: "offer-2",
    title: "Festive Gold Offer",
    description: "Flat Ã¢â€šÂ¹5,000 off when you buy 2 or more Banarasi Silks.",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop",
    isActive: true
  }
];

const defaultHeroStats = {
  sareesCurated: "500+",
  avgExperience: "5",
  showroomTrips: "0"
};

const defaultSpecialsCategories = [
  { id: "Kanchi Pattu", name: "Kanchi Pattu", subtitle: "The temple weave", desc: "Pure mulberry silk and zari from the looms of Kanchipuram. Heirloom drapes meant to outlive trends." },
  { id: "Banarasi Silk", name: "Banarasi & Bridal", subtitle: "The royal drape", desc: "Intricate brocades and rich silks woven in the holy city of Varanasi, perfect for grand celebrations." },
  { id: "Designer Sarees", name: "Designer Party Wear", subtitle: "Modern elegance", desc: "Contemporary silhouettes and embellished details for the modern woman's festive wardrobe." },
  { id: "Kalamkari", name: "Kalamkari", subtitle: "Art on fabric", desc: "Hand-painted and block-printed stories on pure silk, showcasing the ancient art form of Andhra." },
];

const AdminContext = createContext();

export function AdminProvider({ children }) {
  // --- STATE INITIALIZATION ---
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("admin_products");
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge new static products (sarees + dresses) that might have been added
      const allStatic = [...PRODUCTS, ...ALL_DRESS_PRODUCTS];
      const newProducts = allStatic.filter(p => !parsed.find(savedP => savedP.id === p.id));
      return [...newProducts, ...parsed];
    }
    return [...PRODUCTS, ...ALL_DRESS_PRODUCTS];
  });

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem("admin_categories");
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure it's an array of strings (cleanup any corrupted data)
      let clean = parsed.map(c => typeof c === 'string' ? c : (c.name || c.id || 'Unknown')); if (!clean.includes('Jewellery')) clean.push('Jewellery'); return clean;
    }
    return CATEGORIES;
  });

  const [heroImages, setHeroImages] = useState(() => {
    const saved = localStorage.getItem("admin_heroImages");
    return saved ? JSON.parse(saved) : defaultHeroImages;
  });

  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem("admin_reviews");
    return saved ? JSON.parse(saved) : defaultReviews;
  });

  const [contactInfo, setContactInfo] = useState(() => {
    const saved = localStorage.getItem("admin_contactInfo");
    return saved ? JSON.parse(saved) : defaultContactInfo;
  });

  const [legalPages, setLegalPages] = useState(() => {
    const saved = localStorage.getItem("admin_legalPages");
    return saved ? JSON.parse(saved) : defaultLegalPages;
  });

  const [offers, setOffers] = useState(() => {
    const saved = localStorage.getItem("admin_offers");
    return saved ? JSON.parse(saved) : defaultOffers;
  });

  const [heroStats, setHeroStats] = useState(() => {
    const saved = localStorage.getItem("admin_heroStats");
    return saved ? JSON.parse(saved) : defaultHeroStats;
  });

  const [specialsCategories, setSpecialsCategories] = useState(() => {
    const saved = localStorage.getItem("admin_specialsCategories");
    return saved ? JSON.parse(saved) : defaultSpecialsCategories;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("admin_auth") === "true";
  });

  // --- PERSISTENCE ---
  useEffect(() => { localStorage.setItem("admin_products", JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem("admin_categories", JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem("admin_heroImages", JSON.stringify(heroImages)); }, [heroImages]);
  useEffect(() => { localStorage.setItem("admin_reviews", JSON.stringify(reviews)); }, [reviews]);
  useEffect(() => { localStorage.setItem("admin_contactInfo", JSON.stringify(contactInfo)); }, [contactInfo]);
  useEffect(() => { localStorage.setItem("admin_legalPages", JSON.stringify(legalPages)); }, [legalPages]);
  useEffect(() => { localStorage.setItem("admin_offers", JSON.stringify(offers)); }, [offers]);
  useEffect(() => {
    localStorage.setItem("admin_heroStats", JSON.stringify(heroStats));
  }, [heroStats]);

  useEffect(() => {
    localStorage.setItem("admin_specialsCategories", JSON.stringify(specialsCategories));
  }, [specialsCategories]);

  // --- ACTIONS ---
  // Products
  const addProduct = (product) => setProducts([product, ...products]);
  const updateProduct = (id, updatedProduct) => setProducts(products.map(p => p.id === id ? updatedProduct : p));
  const deleteProduct = (id) => setProducts(products.filter(p => p.id !== id));

  // Categories
  const addCategory = (category) => setCategories([...categories, category]);
  const updateCategory = (oldCategory, newCategory) => setCategories(categories.map(c => c === oldCategory ? newCategory : c));
  const deleteCategory = (category) => setCategories(categories.filter(c => c !== category));

  // Hero Images
  const updateHeroImages = (newImages) => setHeroImages(newImages);

  // Reviews
  const addReview = (review) => setReviews([review, ...reviews]);
  const updateReview = (id, updatedReview) => setReviews(reviews.map(r => r.id === id ? updatedReview : r));
  const deleteReview = (id) => setReviews(reviews.filter(r => r.id !== id));

  // Contact Info
  const updateContactInfo = (newInfo) => setContactInfo(newInfo);

  // Legal Pages
  const updateLegalPages = (newPages) => setLegalPages(newPages);

  // Offers
  const addOffer = (offer) => setOffers([offer, ...offers]);
  const updateOffer = (id, updatedOffer) => setOffers(offers.map(o => o.id === id ? updatedOffer : o));
  const deleteOffer = (id) => setOffers(offers.filter(o => o.id !== id));

  // Hero Stats
  const updateHeroStats = (stats) => setHeroStats(stats);

  // Specials Categories
  const addSpecialCategory = (category) => setSpecialsCategories([...specialsCategories, category]);
  const updateSpecialCategory = (id, updated) => setSpecialsCategories(specialsCategories.map(c => c.id === id ? updated : c));
  const deleteSpecialCategory = (id) => setSpecialsCategories(specialsCategories.filter(c => c.id !== id));

  // Auth
  const login = (username, password) => {
    if (username === "admin" && password === "admin@alankrita") {
      setIsAuthenticated(true);
      sessionStorage.setItem("admin_auth", "true");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("admin_auth");
  };

  return (
    <AdminContext.Provider value={{
      products, addProduct, updateProduct, deleteProduct,
      categories, addCategory, updateCategory, deleteCategory,
      heroImages, updateHeroImages,
      reviews, addReview, updateReview, deleteReview,
      contactInfo, updateContactInfo,
      legalPages, updateLegalPages,
      offers, addOffer, updateOffer, deleteOffer,
      heroStats, updateHeroStats,
      specialsCategories, addSpecialCategory, updateSpecialCategory, deleteSpecialCategory,
      isAuthenticated, login, logout
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);




