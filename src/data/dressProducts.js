/**
 * Dress Products Data — Firebase-ready structure.
 * Each category has 8 unique images from curated sources.
 * Slugs match the URL pattern: /dresses/:slug
 */

// ─── CATEGORY META ──────────────────────────────────────────────────────────

export const DRESS_CATEGORIES_META = {
  "party-wear":  { name: "Party Wear",  subtitle: "Glamour & Grace",             desc: "Elegant Indian party and evening fashion dresses for your most glamorous occasions.", bgColor: "bg-[#72242C]/5"  },
  "casual-wear": { name: "Casual Wear", subtitle: "Everyday Elegance",           desc: "Stylish, comfortable everyday Indo-western dresses that go from day to night.",        bgColor: "bg-gold/5"       },
  "sports-wear": { name: "Sports Wear", subtitle: "Active Modesty",              desc: "Modern modest activewear designed for performance without compromising elegance.",      bgColor: "bg-white"        },
  "office-wear": { name: "Office Wear", subtitle: "Professional Sophistication", desc: "Sophisticated Indo-western workwear that commands confidence in the boardroom.",        bgColor: "bg-[#FAF9F6]"   },
  "festive-wear":{ name: "Festive Wear",subtitle: "Celebrate in Style",          desc: "Rich festive Indian fashion with embroidery and traditional elements for celebrations.",bgColor: "bg-[#72242C]/10" },
  "ethnic-wear": { name: "Ethnic Wear", subtitle: "Timeless Tradition",          desc: "Heritage Indian ethnic silhouettes and premium textiles that honor our culture.",       bgColor: "bg-gold/10"      },
};

// ─── CATEGORY CARDS (used on /dresses landing) ──────────────────────────────

export const DRESS_CATEGORY_CARDS = [
  {
    id:    "party-wear",
    name:  "Party Wear",
    desc:  "Glamorous Indian & Indo-western dresses for evening events.",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
  },
  {
    id:    "casual-wear",
    name:  "Casual Wear",
    desc:  "Stylish, comfortable everyday Indo-western dresses.",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
  },
  {
    id:    "sports-wear",
    name:  "Sports Wear",
    desc:  "Premium modest activewear for an active lifestyle.",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
  },
  {
    id:    "office-wear",
    name:  "Office Wear",
    desc:  "Sophisticated professional Indo-western workwear.",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80",
  },
  {
    id:    "festive-wear",
    name:  "Festive Wear",
    desc:  "Rich festive ensembles for celebrations and occasions.",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80",
  },
  {
    id:    "ethnic-wear",
    name:  "Ethnic Wear",
    desc:  "Heritage Indian ethnic silhouettes and traditional textiles.",
    image: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80",
  },
];

// ─── PRODUCTS PER CATEGORY ───────────────────────────────────────────────────

export const DRESS_PRODUCTS = {

  "party-wear": [
    { id:"PW-001", name:"Velvet Midnight Gown",     category:"Party Wear", description:"Deep maroon velvet gown with gold zari embroidery — the ultimate evening statement.", price:22000, image:"https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80", images:[], availability:true, featured:true,  isNew:true,  isFeatured:true  },
    { id:"PW-002", name:"Jewel Wine Lehenga",       category:"Party Wear", description:"Wine-red lehenga with mirror and thread embroidery. Glam silhouette for festive evenings.", price:28000, image:"https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&q=80", images:[], availability:true, featured:false, isNew:true,  isFeatured:false },
    { id:"PW-003", name:"Gold Drape Anarkali",      category:"Party Wear", description:"Floor-length Anarkali with gold tissue fabric and rich embroidery detailing.", price:18500, image:"https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&q=80", images:[], availability:true, featured:false, isNew:false, isFeatured:true  },
    { id:"PW-004", name:"Scarlet Indo-Gown",        category:"Party Wear", description:"Scarlet Indo-western evening gown with sheer overlay and gold border trim.", price:19000, image:"https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&q=80", images:[], availability:true, featured:false, isNew:false, isFeatured:false },
    { id:"PW-005", name:"Royal Maroon Sharara",     category:"Party Wear", description:"Regal maroon sharara set with intricate zardosi work and flared silhouette.", price:24000, image:"https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80", images:[], availability:true, featured:false, isNew:false, isFeatured:false },
    { id:"PW-006", name:"Noir Sequin Dress",        category:"Party Wear", description:"Midnight black Indo-western sequin dress for high-glam party occasions.", price:15500, image:"https://images.unsplash.com/photo-1603189343302-e603f7add05a?w=600&q=80", images:[], availability:true, featured:false, isNew:false, isFeatured:false },
    { id:"PW-007", name:"Garnet Palazzo Set",       category:"Party Wear", description:"Garnet palazzo suit with embroidered kurti and dupatta, ideal for cocktail evenings.", price:17000, image:"https://images.unsplash.com/photo-1620799139507-2a76f79a2f4d?w=600&q=80", images:[], availability:true, featured:false, isNew:true,  isFeatured:false },
    { id:"PW-008", name:"Sapphire Cape Gown",       category:"Party Wear", description:"Sapphire blue cape-style Indo-western gown with contrast gold embroidery.", price:21000, image:"https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=600&q=80", images:[], availability:true, featured:false, isNew:false, isFeatured:false },
  ],

  "casual-wear": [
    { id:"CW-001", name:"Breezy Linen Kurti",       category:"Casual Wear", description:"Light linen kurti in soft peach with minimal block print detailing. Comfortable for daily wear.", price:3200, image:"https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80", images:[], availability:true, featured:true,  isNew:true,  isFeatured:true  },
    { id:"CW-002", name:"Everyday Floral Wrap",     category:"Casual Wear", description:"Floral cotton wrap dress in soft yellows and ivory, perfect for a casual day out.", price:2800, image:"https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80", images:[], availability:true, featured:false, isNew:true,  isFeatured:false },
    { id:"CW-003", name:"Stripe Palazzo Set",       category:"Casual Wear", description:"Casual stripe palazzo coord in soft cotton. Airy and comfortable for summer days.", price:3500, image:"https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80", images:[], availability:true, featured:false, isNew:false, isFeatured:false },
    { id:"CW-004", name:"Pastel Kurta Pant",        category:"Casual Wear", description:"Soft mint kurta with matching pants and subtle embroidery on neck and cuffs.", price:4000, image:"https://images.unsplash.com/photo-1529139574466-a303027614b7?w=600&q=80", images:[], availability:true, featured:false, isNew:false, isFeatured:true  },
    { id:"CW-005", name:"Indigo Block Print Dress", category:"Casual Wear", description:"Traditional indigo block-print casual dress in breathable cotton. Effortlessly chic.", price:3800, image:"https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80", images:[], availability:true, featured:false, isNew:false, isFeatured:false },
    { id:"CW-006", name:"Olive Green Jumpsuit",     category:"Casual Wear", description:"Smart olive green Indo-western jumpsuit, relaxed fit with tie-up waist.", price:4200, image:"https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&q=80", images:[], availability:true, featured:false, isNew:false, isFeatured:false },
    { id:"CW-007", name:"Cream Cotton Sundress",    category:"Casual Wear", description:"Ivory cotton sundress with eyelet detailing. Minimal and elegant for casual occasions.", price:2600, image:"https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80", images:[], availability:true, featured:false, isNew:true,  isFeatured:false },
    { id:"CW-008", name:"Rust Linen Co-ord",        category:"Casual Wear", description:"Rust-toned linen co-ord set with relaxed silhouette — modern casual wear for every day.", price:3900, image:"https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=600&q=80", images:[], availability:true, featured:false, isNew:false, isFeatured:false },
  ],

  "sports-wear": [
    { id:"SW-001", name:"Active Flow Tracksuit",    category:"Sports Wear", description:"Premium navy tracksuit with gold stripe detailing. Full coverage and flexible fit.", price:5500, image:"https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80", images:[], availability:true, featured:true,  isNew:true,  isFeatured:true  },
    { id:"SW-002", name:"Yoga Fit Set",             category:"Sports Wear", description:"Soft stretch yoga set in midnight black. High waist leggings with matching crop jacket.", price:4800, image:"https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=600&q=80", images:[], availability:true, featured:false, isNew:true,  isFeatured:false },
    { id:"SW-003", name:"Run & Style Jacket",       category:"Sports Wear", description:"Lightweight windproof running jacket in teal. Minimalist design with zippered pockets.", price:3900, image:"https://images.unsplash.com/photo-1483721310020-03333e577078?w=600&q=80", images:[], availability:true, featured:false, isNew:false, isFeatured:false },
    { id:"SW-004", name:"Power Move Set",           category:"Sports Wear", description:"Performance-grade sports set in charcoal grey. Breathable mesh panels for active use.", price:6000, image:"https://images.unsplash.com/photo-1622519407650-3df9883f76a5?w=600&q=80", images:[], availability:true, featured:false, isNew:false, isFeatured:true  },
    { id:"SW-005", name:"Stride Comfort Pants",     category:"Sports Wear", description:"Wide-leg athletic pants with moisture-wicking fabric. Versatile for gym or street.", price:3200, image:"https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&q=80", images:[], availability:true, featured:false, isNew:false, isFeatured:false },
    { id:"SW-006", name:"Elevate Hoodie Dress",     category:"Sports Wear", description:"Long hoodie dress with side slits. Casual athletic look with premium cotton blend.", price:4100, image:"https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&q=80", images:[], availability:true, featured:false, isNew:true,  isFeatured:false },
    { id:"SW-007", name:"Bold Crop Coord",          category:"Sports Wear", description:"Bold maroon crop top and wide-leg track pants coord. Statement sportswear.", price:4600, image:"https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=600&q=80", images:[], availability:true, featured:false, isNew:false, isFeatured:false },
    { id:"SW-008", name:"Sprint Slim Set",          category:"Sports Wear", description:"Slim-fit running shorts and tank top set. Lightweight fabric ideal for outdoor fitness.", price:3500, image:"https://images.unsplash.com/photo-1504439468489-c8920d796a29?w=600&q=80", images:[], availability:true, featured:false, isNew:false, isFeatured:false },
  ],

  "office-wear": [
    { id:"OW-001", name:"Boardroom Kurta Set",      category:"Office Wear", description:"Sophisticated ivory and gold kurta with straight-cut trousers. Polished workwear.", price:8500, image:"https://images.unsplash.com/photo-1594938298603-c8148c4b984e?w=600&q=80", images:[], availability:true, featured:true,  isNew:true,  isFeatured:true  },
    { id:"OW-002", name:"Classic Blazer Dress",     category:"Office Wear", description:"Elegant fitted blazer dress in charcoal with subtle maroon lining. Office-perfect.", price:9200, image:"https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&q=80", images:[], availability:true, featured:false, isNew:true,  isFeatured:false },
    { id:"OW-003", name:"Formal Linen Suit",        category:"Office Wear", description:"Tailored linen suit in warm beige with structured shoulders. Comfortable formal wear.", price:11000, image:"https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&q=80", images:[], availability:true, featured:false, isNew:false, isFeatured:false },
    { id:"OW-004", name:"Pencil Skirt Coord",       category:"Office Wear", description:"Fitted pencil skirt with matching blouse in champagne. Smart professional styling.", price:7800, image:"https://images.unsplash.com/photo-1588421357574-87938a86fa28?w=600&q=80", images:[], availability:true, featured:false, isNew:false, isFeatured:true  },
    { id:"OW-005", name:"Indo-Western Tunic Set",   category:"Office Wear", description:"Modern Indo-western tunic with palazzos. Ethnic elegance appropriate for the workplace.", price:8000, image:"https://images.unsplash.com/photo-1548142813-c348350df52b?w=600&q=80", images:[], availability:true, featured:false, isNew:false, isFeatured:false },
    { id:"OW-006", name:"Structured Kurti Pants",   category:"Office Wear", description:"Structured straight-cut kurti with cigarette pants in light grey. Professional and chic.", price:6900, image:"https://images.unsplash.com/photo-1551803091-e20673f15770?w=600&q=80", images:[], availability:true, featured:false, isNew:true,  isFeatured:false },
    { id:"OW-007", name:"Pearl White Suit Set",     category:"Office Wear", description:"Pearl white formal suit set with subtle embroidery. Elegant and authoritative.", price:12000, image:"https://images.unsplash.com/photo-1613514785940-daed07799d9b?w=600&q=80", images:[], availability:true, featured:false, isNew:false, isFeatured:false },
    { id:"OW-008", name:"Minimal Shift Dress",      category:"Office Wear", description:"Clean-cut shift dress in slate blue. Minimalist design for confident professionals.", price:7200, image:"https://images.unsplash.com/photo-1520367445093-50dc08a59d9d?w=600&q=80", images:[], availability:true, featured:false, isNew:false, isFeatured:false },
  ],

  "festive-wear": [
    { id:"FW-001", name:"Diwali Splendour Lehenga", category:"Festive Wear", description:"Rich maroon lehenga with heavy gold zari border. Perfect for Diwali and festive puja.", price:32000, image:"https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&q=80", images:[], availability:true, featured:true,  isNew:true,  isFeatured:true  },
    { id:"FW-002", name:"Golden Lehenga Choli",     category:"Festive Wear", description:"Gold tissue lehenga choli with heavy embroidery and flared silhouette for celebrations.", price:42000, image:"https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?w=600&q=80", images:[], availability:true, featured:false, isNew:true,  isFeatured:false },
    { id:"FW-003", name:"Marigold Anarkali",        category:"Festive Wear", description:"Saffron-marigold Anarkali with mirror embroidery and rich silk fabric for grand occasions.", price:18000, image:"https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&q=80", images:[], availability:true, featured:false, isNew:false, isFeatured:false },
    { id:"FW-004", name:"Crimson Sharara",          category:"Festive Wear", description:"Crimson sharara with gota-patti work on the hemline. Ideal for Eid and festive events.", price:21000, image:"https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=600&q=80", images:[], availability:true, featured:false, isNew:false, isFeatured:true  },
    { id:"FW-005", name:"Haldi Yellow Gharara",     category:"Festive Wear", description:"Vibrant yellow gharara set with floral embroidery and delicate dupatta. Haldi-perfect.", price:15000, image:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", images:[], availability:true, featured:false, isNew:false, isFeatured:false },
    { id:"FW-006", name:"Emerald Zari Kurta Set",   category:"Festive Wear", description:"Emerald green kurta set with gold zari embroidery. Elegant festive ensemble.", price:16000, image:"https://images.unsplash.com/photo-1609743522653-52354461eb27?w=600&q=80", images:[], availability:true, featured:false, isNew:true,  isFeatured:false },
    { id:"FW-007", name:"Navratri Chaniya Choli",   category:"Festive Wear", description:"Traditional bandhani chaniya choli for Navratri. Rich jewel tones with mirror work.", price:14000, image:"https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=600&q=80", images:[], availability:true, featured:false, isNew:false, isFeatured:false },
    { id:"FW-008", name:"Ruby Cape Anarkali",       category:"Festive Wear", description:"Ruby red cape-style Anarkali with sequin and bead embellishments. Head-turner.", price:23000, image:"https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80", images:[], availability:true, featured:false, isNew:false, isFeatured:false },
  ],

  "ethnic-wear": [
    { id:"EW-001", name:"Heritage Kanjivaram",      category:"Ethnic Wear", description:"Authentic Kanjivaram silk saree in royal purple with traditional temple border.", price:55000, image:"https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&q=80", images:[], availability:true, featured:true,  isNew:false, isFeatured:true  },
    { id:"EW-002", name:"Rajwada Suit Set",         category:"Ethnic Wear", description:"Traditional Rajasthani suit in earthy terracotta with gota-patti and mirror embroidery.", price:14000, image:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80", images:[], availability:true, featured:false, isNew:false, isFeatured:false },
    { id:"EW-003", name:"Chanderi Block Saree",     category:"Ethnic Wear", description:"Chanderi silk saree with traditional block print in sage green and gold. Understated elegance.", price:18000, image:"https://images.unsplash.com/photo-1590086782792-42dd2350140d?w=600&q=80", images:[], availability:true, featured:false, isNew:true,  isFeatured:false },
    { id:"EW-004", name:"Mughal Brocade Kurta",     category:"Ethnic Wear", description:"Brocade kurta with Mughal-inspired motifs in ivory and gold. Paired with harem pants.", price:12000, image:"https://images.unsplash.com/photo-1617004143896-7a9f7deb1ed6?w=600&q=80", images:[], availability:true, featured:false, isNew:false, isFeatured:true  },
    { id:"EW-005", name:"Patola Silk Saree",        category:"Ethnic Wear", description:"Handwoven Patola silk saree with geometric ikat pattern in rust and cream.", price:48000, image:"https://images.unsplash.com/photo-1609743522653-52354461eb27?w=600&q=80", images:[], availability:true, featured:false, isNew:false, isFeatured:false },
    { id:"EW-006", name:"Phulkari Patiala Set",     category:"Ethnic Wear", description:"Vibrant Punjabi Phulkari salwar suit with patiala bottoms. Heritage-inspired festive look.", price:11000, image:"https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=600&q=80", images:[], availability:true, featured:false, isNew:true,  isFeatured:false },
    { id:"EW-007", name:"Bengal Tant Saree",        category:"Ethnic Wear", description:"Lightweight Bengal tant cotton saree with traditional red and white motifs.", price:9500,  image:"https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?w=600&q=80", images:[], availability:true, featured:false, isNew:false, isFeatured:false },
    { id:"EW-008", name:"Ikat Palazzo Suit",        category:"Ethnic Wear", description:"Ikat-print palazzo suit set in deep indigo with contrast embroidery on dupatta.", price:13000, image:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", images:[], availability:true, featured:false, isNew:false, isFeatured:false },
  ],

};

// ─── FLAT LIST (for search) ──────────────────────────────────────────────────
// All dress products in one array — used by the search system.
export const ALL_DRESS_PRODUCTS = Object.values(DRESS_PRODUCTS).flat();
