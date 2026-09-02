import { Link } from "react-router-dom";
import { Instagram, Phone, Mail, MapPin, ArrowRight, Facebook, Twitter, Lock } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import logo from "@/assets/logo.png";

export function Footer() {
  const { contactInfo } = useAdmin();
  const footerLinks = [
    { label: "Home", path: "/" },
    { label: "Collections", path: "/collections" },
    { label: "Specials", path: "/specials" },
    { label: "Our Story", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  const categories = [
    "Kanchi Pattu",
    "Banarasi Silk",
    "Kalamkari",
    "Designer Sarees",
  ];

  return (
    <footer className="bg-primary pt-24 pb-32 lg:pb-12 text-primary-foreground border-t border-gold/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">


        {/* Middle Section: Links & Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8 mb-16">

          {/* Brand Info */}
          <div className="md:col-span-2 lg:pr-12">
            <h2 className="font-script text-5xl lg:text-6xl text-gold mb-3">Alankrita</h2>
            <div className="text-[10px] uppercase tracking-[0.3em] text-gold mb-6 font-semibold">
              BY ANNAMMA TRADERS • SINCE 2020
            </div>
            <p className="text-white/80 text-[15px] leading-loose max-w-md font-serif">
              Discover timeless elegance with Alankrita Silks. We bring exquisite pattu, silk, kalamkari, and designer sarees directly to your doorstep, celebrating tradition, craftsmanship, and grace in every weave.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-[11px] uppercase tracking-[0.3em] text-gold font-semibold mb-6">Explore</h4>
            <ul className="space-y-4">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="text-[15px] text-white hover:text-gold transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[11px] uppercase tracking-[0.3em] text-gold font-semibold mb-6">Reach Us</h4>
            <ul className="space-y-4 text-[15px] text-white">
              <li className="flex items-center gap-3 hover:text-gold transition-colors cursor-pointer">
                <Phone size={14} className="text-gold shrink-0" />
                <span>+91 86886 32684</span>
              </li>
              <li className="flex items-center gap-3 hover:text-gold transition-colors cursor-pointer">
                <Mail size={14} className="text-gold shrink-0" />
                <span>annammatraders98@gmail.com</span>
              </li>
              <li className="flex items-center gap-3 hover:text-gold transition-colors cursor-pointer">
                <MapPin size={14} className="text-gold shrink-0" />
                <span>Nagole, Hyderabad</span>
              </li>
              <li className="flex items-center gap-3 hover:text-gold transition-colors cursor-pointer">
                <Instagram size={14} className="text-gold shrink-0" />
                <span>@alankrita.silks</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Section: Copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="text-[11px] uppercase tracking-[0.3em] text-white/70 font-semibold">
              © 2026 ALANKRITA SILKS
            </div>
            <div className="flex flex-wrap justify-center items-center gap-4 text-[10px] uppercase tracking-[0.2em] text-white/50">
              <Link to="/privacy" className="hover:text-gold transition-colors">Privacy Policy</Link>
              <span className="opacity-30">|</span>
              <Link to="/terms" className="hover:text-gold transition-colors">Terms & Conditions</Link>
              <span className="opacity-30">|</span>
              <Link to="/admin" className="hover:text-gold transition-colors flex items-center gap-1">
                <Lock size={10} /> Admin
              </Link>
            </div>
          </div>
          <div className="text-gold font-script italic text-lg lg:text-xl">
            Crafted by Annamma Traders · Woven with Grace
          </div>
        </div>

      </div>
    </footer>
  );
}
