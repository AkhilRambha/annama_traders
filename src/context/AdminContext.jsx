import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, doc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
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
  // --- STATE INITIALIZATION (Defaults while loading) ---
  const [products, setProducts] = useState([...PRODUCTS, ...ALL_DRESS_PRODUCTS]);
  const [categories, setCategories] = useState([...new Set(CATEGORIES)]);
  const [heroImages, setHeroImages] = useState(defaultHeroImages);
  const [reviews, setReviews] = useState(defaultReviews);
  const [contactInfo, setContactInfo] = useState(defaultContactInfo);
  const [legalPages, setLegalPages] = useState(defaultLegalPages);
  const [offers, setOffers] = useState(defaultOffers);
  const [heroStats, setHeroStats] = useState(defaultHeroStats);
  const [specialsCategories, setSpecialsCategories] = useState(defaultSpecialsCategories);
  
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("admin_auth") === "true";
  });

  // --- FIREBASE SYNC (REAL-TIME LISTENER) ---
  useEffect(() => {
    // Listen to Products
    const unsubProducts = onSnapshot(collection(db, "products"), (snap) => {
      if (!snap.empty) {
        const fbProducts = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(fbProducts);
      }
    }, (error) => {
      console.log("Firebase not configured yet or empty. Using default products.", error);
    });

    // Listen to Reviews
    const unsubReviews = onSnapshot(collection(db, "reviews"), (snap) => {
      if (!snap.empty) {
        const fbReviews = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setReviews(fbReviews);
      }
    });

    // Listen to Offers
    const unsubOffers = onSnapshot(collection(db, "offers"), (snap) => {
      if (!snap.empty) {
        const fbOffers = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOffers(fbOffers);
      }
    });
    
    // Listen to Specials
    const unsubSpecials = onSnapshot(collection(db, "specials"), (snap) => {
      if (!snap.empty) {
        const fbSpecials = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSpecialsCategories(fbSpecials);
      }
    });

    // Listen to Site Settings (Singleton Document)
    const unsubSettings = onSnapshot(doc(db, "settings", "global"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.categories) setCategories(data.categories);
        if (data.heroImages) setHeroImages(data.heroImages);
        if (data.contactInfo) setContactInfo(data.contactInfo);
        if (data.legalPages) setLegalPages(data.legalPages);
        if (data.heroStats) setHeroStats(data.heroStats);
      }
    });

    return () => {
      unsubProducts();
      unsubReviews();
      unsubOffers();
      unsubSpecials();
      unsubSettings();
    };
  }, []);

  // --- FIREBASE ACTIONS ---
  
  // Products
  const addProduct = async (product) => {
    // Optimistic update
    setProducts([product, ...products]);
    try { await setDoc(doc(db, "products", product.id), product); } catch(e) { console.error(e); }
  };
  const updateProduct = async (id, updatedProduct) => {
    setProducts(products.map(p => p.id === id ? updatedProduct : p));
    try { await updateDoc(doc(db, "products", id), updatedProduct); } catch(e) { console.error(e); }
  };
  const deleteProduct = async (id) => {
    setProducts(products.filter(p => p.id !== id));
    try { await deleteDoc(doc(db, "products", id)); } catch(e) { console.error(e); }
  };

  // Settings sync helper
  const updateSettings = async (key, value) => {
    try { await setDoc(doc(db, "settings", "global"), { [key]: value }, { merge: true }); } catch(e) { console.error(e); }
  };

  // Categories
  const addCategory = (category) => {
    const newCat = [...categories, category];
    setCategories(newCat);
    updateSettings("categories", newCat);
  };
  const updateCategory = (oldCategory, newCategory) => {
    const newCat = categories.map(c => c === oldCategory ? newCategory : c);
    setCategories(newCat);
    updateSettings("categories", newCat);
  };
  const deleteCategory = (category) => {
    const newCat = categories.filter(c => c !== category);
    setCategories(newCat);
    updateSettings("categories", newCat);
  };

  // Hero Images
  const updateHeroImages = (newImages) => {
    setHeroImages(newImages);
    updateSettings("heroImages", newImages);
  };

  // Reviews
  const addReview = async (review) => {
    setReviews([review, ...reviews]);
    try { 
      const reviewId = review.id ? String(review.id) : String(Date.now());
      await setDoc(doc(db, "reviews", reviewId), { ...review, id: reviewId }); 
    } catch(e) {}
  };
  const updateReview = async (id, updatedReview) => {
    setReviews(reviews.map(r => String(r.id) === String(id) ? updatedReview : r));
    try { await updateDoc(doc(db, "reviews", String(id)), updatedReview); } catch(e) {}
  };
  const deleteReview = async (id) => {
    setReviews(reviews.filter(r => String(r.id) !== String(id)));
    try { await deleteDoc(doc(db, "reviews", String(id))); } catch(e) {}
  };

  // Contact Info
  const updateContactInfo = (newInfo) => {
    setContactInfo(newInfo);
    updateSettings("contactInfo", newInfo);
  };

  // Legal Pages
  const updateLegalPages = (newPages) => {
    setLegalPages(newPages);
    updateSettings("legalPages", newPages);
  };

  // Offers
  const addOffer = async (offer) => {
    setOffers([offer, ...offers]);
    try { await setDoc(doc(db, "offers", offer.id), offer); } catch(e) {}
  };
  const updateOffer = async (id, updatedOffer) => {
    setOffers(offers.map(o => o.id === id ? updatedOffer : o));
    try { await updateDoc(doc(db, "offers", id), updatedOffer); } catch(e) {}
  };
  const deleteOffer = async (id) => {
    setOffers(offers.filter(o => o.id !== id));
    try { await deleteDoc(doc(db, "offers", id)); } catch(e) {}
  };

  // Hero Stats
  const updateHeroStats = (stats) => {
    setHeroStats(stats);
    updateSettings("heroStats", stats);
  };

  // Specials Categories
  const addSpecialCategory = async (category) => {
    setSpecialsCategories([...specialsCategories, category]);
    try { await setDoc(doc(db, "specials", category.id), category); } catch(e) {}
  };
  const updateSpecialCategory = async (id, updated) => {
    setSpecialsCategories(specialsCategories.map(c => c.id === id ? updated : c));
    try { await updateDoc(doc(db, "specials", id), updated); } catch(e) {}
  };
  const deleteSpecialCategory = async (id) => {
    setSpecialsCategories(specialsCategories.filter(c => c.id !== id));
    try { await deleteDoc(doc(db, "specials", id)); } catch(e) {}
  };

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
