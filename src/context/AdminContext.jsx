import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import {
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updatePassword
} from "firebase/auth";
import { collection, onSnapshot, doc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { CATEGORIES } from "@/data/products";

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
  const [products, setProducts] = useState([]);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [productsLoadError, setProductsLoadError] = useState(null);
  const [categories, setCategories] = useState([...new Set(CATEGORIES)]);
  const [heroImages, setHeroImages] = useState(defaultHeroImages);
  const [reviews, setReviews] = useState(defaultReviews);
  const [contactInfo, setContactInfo] = useState(defaultContactInfo);
  const [legalPages, setLegalPages] = useState(defaultLegalPages);
  const [offers, setOffers] = useState(defaultOffers);
  const [heroStats, setHeroStats] = useState(defaultHeroStats);
  const [specialsCategories, setSpecialsCategories] = useState(defaultSpecialsCategories);

  const [firebaseUser, setFirebaseUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const isAuthenticated = Boolean(firebaseUser);
  const adminEmail = firebaseUser?.email || "";

  useEffect(() => {
    return onAuthStateChanged(auth, user => {
      setFirebaseUser(user);
      setIsAuthReady(true);
    });
  }, []);

  // --- FIREBASE SYNC (REAL-TIME LISTENER) ---
  useEffect(() => {
    // Listen to Products
    const unsubProducts = onSnapshot(collection(db, "products"), (snap) => {
      const loadedProducts = snap.docs.map(productDoc => ({ id: productDoc.id, ...productDoc.data() }));
      setProducts(loadedProducts);
      setProductsLoadError(null);
      if (loadedProducts.length > 0 || !snap.metadata.fromCache) {
        setProductsLoaded(true);
      }
    }, (error) => {
      console.error("Failed to load products from Firestore:", error);
      setProductsLoadError(error instanceof Error ? error.message : "Product data could not be loaded.");
      setProductsLoaded(true);
    });

    // Listen to Reviews
    const unsubReviews = onSnapshot(collection(db, "reviews"), (snap) => {
      if (!snap.empty) {
        const fbReviews = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setReviews(fbReviews);
      }
    }, error => console.error("Failed to load reviews from Firestore:", error));

    // Listen to Offers
    const unsubOffers = onSnapshot(collection(db, "offers"), (snap) => {
      if (!snap.empty) {
        const fbOffers = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOffers(fbOffers);
      }
    }, error => console.error("Failed to load offers from Firestore:", error));

    // Listen to Specials
    const unsubSpecials = onSnapshot(collection(db, "specials"), (snap) => {
      if (!snap.empty) {
        const fbSpecials = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSpecialsCategories(fbSpecials);
      }
    }, error => console.error("Failed to load specials from Firestore:", error));

    return () => {
      unsubProducts();
      unsubReviews();
      unsubOffers();
      unsubSpecials();
    };
  }, []);

  useEffect(() => {
    return onSnapshot(doc(db, "settings", "global"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.categories) setCategories(data.categories);
        if (data.heroImages) setHeroImages(data.heroImages);
        if (data.contactInfo) setContactInfo(data.contactInfo);
        if (data.legalPages) setLegalPages(data.legalPages);
        if (data.heroStats) setHeroStats(data.heroStats);
      }
    }, error => {
      console.error("Failed to read public Firestore document settings/global. Check that the published rules allow read access to this document:", error);
    });
  }, []);

  // --- FIREBASE ACTIONS ---

  // Products
  const addProduct = async (product) => {
    await setDoc(doc(db, "products", product.id), product);
    setProducts(currentProducts => [
      product,
      ...currentProducts.filter(currentProduct => currentProduct.id !== product.id)
    ]);
  };
  const updateProduct = async (id, updatedProduct) => {
    await updateDoc(doc(db, "products", id), updatedProduct);
    setProducts(currentProducts => currentProducts.map(product => product.id === id ? updatedProduct : product));
  };
  const deleteProduct = async (id) => {
    await deleteDoc(doc(db, "products", id));
    setProducts(currentProducts => currentProducts.filter(product => product.id !== id));
  };

  // Settings sync helper
  const updateSettings = async (key, value) => {
    await setDoc(doc(db, "settings", "global"), { [key]: value }, { merge: true });
  };

  // Categories
  const addCategory = async (category) => {
    const newCat = [...categories, category];
    await updateSettings("categories", newCat);
    setCategories(newCat);
  };
  const updateCategory = async (oldCategory, newCategory) => {
    const newCat = categories.map(c => c === oldCategory ? newCategory : c);
    await updateSettings("categories", newCat);
    setCategories(newCat);
  };
  const deleteCategory = async (category) => {
    const newCat = categories.filter(c => c !== category);
    await updateSettings("categories", newCat);
    setCategories(newCat);
  };

  // Hero section
  const updateHeroSection = async (newImages, stats) => {
    await setDoc(doc(db, "settings", "global"), {
      heroImages: newImages,
      heroStats: stats
    }, { merge: true });
    setHeroImages(newImages);
    setHeroStats(stats);
  };

  // Reviews
  const addReview = async (review) => {
    const reviewId = review.id ? String(review.id) : String(Date.now());
    const newReview = { ...review, id: reviewId };
    await setDoc(doc(db, "reviews", reviewId), newReview);
    setReviews(currentReviews => [newReview, ...currentReviews.filter(item => String(item.id) !== reviewId)]);
  };
  const updateReview = async (id, updatedReview) => {
    await updateDoc(doc(db, "reviews", String(id)), updatedReview);
    setReviews(currentReviews => currentReviews.map(review => String(review.id) === String(id) ? updatedReview : review));
  };
  const deleteReview = async (id) => {
    await deleteDoc(doc(db, "reviews", String(id)));
    setReviews(currentReviews => currentReviews.filter(review => String(review.id) !== String(id)));
  };

  // Contact Info
  const updateContactInfo = async (newInfo) => {
    await updateSettings("contactInfo", newInfo);
    setContactInfo(newInfo);
  };

  // Legal Pages
  const updateLegalPages = async (newPages) => {
    await updateSettings("legalPages", newPages);
    setLegalPages(newPages);
  };

  // Offers
  const addOffer = async (offer) => {
    await setDoc(doc(db, "offers", offer.id), offer);
    setOffers(currentOffers => [offer, ...currentOffers.filter(item => item.id !== offer.id)]);
  };
  const updateOffer = async (id, updatedOffer) => {
    await updateDoc(doc(db, "offers", id), updatedOffer);
    setOffers(currentOffers => currentOffers.map(offer => offer.id === id ? updatedOffer : offer));
  };
  const deleteOffer = async (id) => {
    await deleteDoc(doc(db, "offers", id));
    setOffers(currentOffers => currentOffers.filter(offer => offer.id !== id));
  };

  // Specials Categories
  const addSpecialCategory = async (category) => {
    await setDoc(doc(db, "specials", category.id), category);
    setSpecialsCategories(currentCategories => [...currentCategories.filter(item => item.id !== category.id), category]);
  };
  const updateSpecialCategory = async (id, updated) => {
    await updateDoc(doc(db, "specials", id), updated);
    setSpecialsCategories(currentCategories => currentCategories.map(category => category.id === id ? updated : category));
  };
  const deleteSpecialCategory = async (id) => {
    await deleteDoc(doc(db, "specials", id));
    setSpecialsCategories(currentCategories => currentCategories.filter(category => category.id !== id));
  };

  // Auth
  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);


  // Cloudinary image upload; returned URLs are saved with product data in Firestore.
  const uploadImage = async (file) => {
    if (!file) return null;
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "sherize_preset");

      const response = await fetch("https://api.cloudinary.com/v1_1/yjhf6lsp/auto/upload", {
        method: "POST",
        body: formData
      });
      const data = await response.json();
      if (!response.ok || !data.secure_url) {
        throw new Error(data.error?.message || "Cloudinary image upload failed.");
      }
      return data.secure_url;
    } catch (error) {
      console.error("Failed to upload image to Cloudinary:", error);
      alert(error instanceof Error ? error.message : "Failed to upload image.");
      return null;
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    const user = auth.currentUser;
    if (!user?.email) throw new Error("No signed-in Firebase account was found.");
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
  };

  const logout = () => signOut(auth);

  return (
    <AdminContext.Provider value={{
      products, productsLoaded, productsLoadError, addProduct, updateProduct, deleteProduct,
      categories, addCategory, updateCategory, deleteCategory,
      heroImages, updateHeroSection,
      reviews, addReview, updateReview, deleteReview,
      contactInfo, updateContactInfo,
      legalPages, updateLegalPages,
      offers, addOffer, updateOffer, deleteOffer,
      heroStats,
      specialsCategories, addSpecialCategory, updateSpecialCategory, deleteSpecialCategory,
      isAuthenticated, isAuthReady, adminEmail, login, logout, changePassword, uploadImage
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);


