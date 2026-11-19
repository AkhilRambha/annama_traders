import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, CreditCard, LockKeyhole, MapPin, Smartphone } from "lucide-react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/products";

const loadRazorpay = () => new Promise(resolve => {
  if (window.Razorpay) return resolve(true);
  const script = document.createElement("script");
  script.src = "https://checkout.razorpay.com/v1/checkout.js";
  script.onload = () => resolve(true);
  script.onerror = () => resolve(false);
  document.body.appendChild(script);
});

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, checkoutItems, checkoutMode, clearCart, clearCheckout } = useCart();
  const submissionInProgress = useRef(false);
  const createdOrderId = useRef("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const checkoutCart = checkoutItems.length ? checkoutItems : cart;
  const subtotal = checkoutCart.reduce((total, item) => total + Number(item.price) * Number(item.quantity || 1), 0);
  const shipping = 0;
  const total = subtotal + shipping;

  const saveOrder = async (paymentStatus, paymentId = "", customer = form) => {
    const orderId = createdOrderId.current || `AT-${Date.now()}`;
    createdOrderId.current = orderId;
    const sanitize = value => {
      if (value == null) return "";
      if (Array.isArray(value)) return value.map(sanitize);
      if (typeof value === "object") {
        return Object.fromEntries(
          Object.entries(value)
            .filter(([, nested]) => nested !== undefined)
            .map(([key, nested]) => [key, sanitize(nested)])
        );
      }
      return value;
    };
    const order = {
      id: orderId,
      items: checkoutCart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        category: item.category,
      })),
      customer,
      subtotal,
      shipping,
      total,
      paymentMethod,
      paymentStatus,
      paymentId,
      createdAt: new Date().toISOString(),
    };
    await setDoc(doc(db, "orders", orderId), sanitize(order));
    return order;
  };

  const placeCashOnDelivery = async customer => {
    try {
      setIsProcessing(true);
      setError("");
      const order = await saveOrder("cod_pending", "", customer);
      if (checkoutMode === "cart") clearCart();
      clearCheckout();
      setSuccess(order);
    } catch (err) {
      const code = err?.code || "";
      console.error("Failed to save COD order:", err);
      if (code === "permission-denied") {
        setError("Order saving is blocked by Firestore rules. Please deploy the orders rules or contact support.");
      } else if (code === "unavailable") {
        setError("The order service is temporarily unavailable. Check your connection and try again.");
      } else {
        setError("We could not save the order. Please check your connection and try again.");
      }
      submissionInProgress.current = false;
    } finally {
      setIsProcessing(false);
    }
  };

  const placeOnlinePayment = async customer => {
    const key = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!key) {
      setError("Online payment is not configured yet. Please use Cash on Delivery or add the Razorpay key.");
      setIsProcessing(false);
      submissionInProgress.current = false;
      return;
    }

    setIsProcessing(true);
    setError("");
    const loaded = await loadRazorpay();
    if (!loaded) {
      setError("The secure payment window could not be loaded.");
      setIsProcessing(false);
      submissionInProgress.current = false;
      return;
    }

    const options = {
      key,
      amount: total * 100,
      currency: "INR",
      name: "Alankrita",
      description: "Order payment",
      prefill: {
        name: customer.name,
        email: customer.email,
        contact: customer.phone,
      },
      theme: { color: "#72242C" },
      handler: async response => {
        try {
          const order = await saveOrder("paid", response.razorpay_payment_id, customer);
          if (checkoutMode === "cart") clearCart();
          clearCheckout();
          setSuccess(order);
        } catch (err) {
          setError("Payment completed, but the order could not be saved. Please contact support.");
          submissionInProgress.current = false;
        } finally {
          setIsProcessing(false);
        }
      },
      modal: {
        ondismiss: () => {
          setIsProcessing(false);
          submissionInProgress.current = false;
        },
      },
    };
    const razorpay = new window.Razorpay(options);
    razorpay.on("payment.failed", response => {
      setError(response?.error?.description || "Payment failed. Please try again.");
      setIsProcessing(false);
      submissionInProgress.current = false;
    });
    razorpay.open();
  };

  const handleSubmit = event => {
    event.preventDefault();
    if (submissionInProgress.current) return;

    const cleanedForm = Object.fromEntries(
      Object.entries(form).map(([key, value]) => [key, String(value).trim()])
    );
    const requiredFields = ["name", "email", "phone", "address", "city", "state", "pincode"];
    if (requiredFields.some(key => !cleanedForm[key])) {
      setError("Please complete all shipping address fields.");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(cleanedForm.phone.replace(/[\s()-]/g, "").replace(/^\+91/, ""))) {
      setError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }
    if (!/^\d{6}$/.test(cleanedForm.pincode)) {
      setError("Please enter a valid 6-digit pincode.");
      return;
    }
    setForm(cleanedForm);
    submissionInProgress.current = true;
    setIsProcessing(true);
    if (paymentMethod === "cod") placeCashOnDelivery(cleanedForm);
    else placeOnlinePayment(cleanedForm);
  };

  if (success) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <CheckCircle2 size={64} className="mx-auto mb-5 text-green-600" />
        <h1 className="mb-3 font-serif text-4xl text-primary">Order confirmed</h1>
        <p className="mb-2 text-muted-foreground">Order number <strong className="text-primary">{success.id}</strong></p>
        <p className="mb-8 text-sm text-muted-foreground">
          {success.paymentMethod === "cod" ? "You can pay when the order is delivered." : "Your secure payment has been received."}
        </p>
        <button onClick={() => navigate("/collections")} className="rounded-sm bg-primary px-8 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground">
          Continue Shopping
        </button>
      </div>
    );
  }

  if (!checkoutCart.length) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="mb-4 font-serif text-4xl text-primary">Your cart is empty</h1>
        <button onClick={() => navigate("/collections")} className="rounded-sm bg-primary px-8 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground">
          Browse Collections
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-screen-xl px-6 pb-24 pt-32 lg:px-10">
      <button type="button" onClick={() => navigate(-1)} className="mb-8 flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-primary">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="mb-10">
        <p className="mb-2 text-xs uppercase tracking-[0.25em] text-gold-deep">Secure checkout</p>
        <h1 className="font-serif text-4xl text-primary md:text-5xl">Checkout</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-8">
          <section className="rounded-sm border border-border p-5 md:p-7">
            <div className="mb-6 flex items-center gap-3 border-b border-border pb-4">
              <MapPin size={20} className="text-gold-deep" />
              <h2 className="font-serif text-xl text-primary">Shipping Address</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                ["name", "Full name", "text", "Your name"],
                ["email", "Email address", "email", "you@example.com"],
                ["phone", "Phone number", "tel", "+91 98765 43210"],
                ["pincode", "Pincode", "text", "500001"],
                ["city", "City", "text", "Hyderabad"],
                ["state", "State", "text", "Telangana"],
              ].map(([key, label, type, placeholder]) => (
                <label key={key} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {label}
                  <input
                    required
                    type={type}
                    inputMode={key === "phone" || key === "pincode" ? "numeric" : undefined}
                    maxLength={key === "pincode" ? 6 : undefined}
                    value={form[key]}
                    onChange={event => setForm(current => ({ ...current, [key]: event.target.value }))}
                    placeholder={placeholder}
                    className="mt-2 w-full rounded-sm border border-border px-3 py-3 text-sm normal-case tracking-normal text-foreground outline-none focus:border-gold"
                  />
                </label>
              ))}
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground md:col-span-2">
                Delivery address
                <textarea
                  required
                  rows={3}
                  value={form.address}
                  onChange={event => setForm(current => ({ ...current, address: event.target.value }))}
                  placeholder="House, street, area and landmark"
                  className="mt-2 w-full resize-none rounded-sm border border-border px-3 py-3 text-sm normal-case tracking-normal text-foreground outline-none focus:border-gold"
                />
              </label>
            </div>
          </section>

          <section className="rounded-sm border border-border p-5 md:p-7">
            <div className="mb-6 flex items-center gap-3 border-b border-border pb-4">
              <LockKeyhole size={20} className="text-gold-deep" />
              <h2 className="font-serif text-xl text-primary">Payment Method</h2>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {[
                ["cod", "Cash on Delivery", MapPin],
                ["upi", "UPI / QR", Smartphone],
                ["card", "Card / Net Banking", CreditCard],
              ].map(([value, label, Icon]) => (
                <label key={value} className={`flex cursor-pointer items-center gap-3 rounded-sm border p-4 transition ${paymentMethod === value ? "border-gold bg-gold/5" : "border-border"}`}>
                  <input type="radio" name="payment" value={value} checked={paymentMethod === value} onChange={() => setPaymentMethod(value)} className="accent-primary" />
                  <Icon size={20} className="text-gold-deep" />
                  <span className="text-sm font-semibold text-primary">{label}</span>
                </label>
              ))}
            </div>
          </section>
        </div>

        <aside className="rounded-sm border border-border bg-accent/5 p-5 md:p-6 lg:sticky lg:top-32">
          <h2 className="mb-5 border-b border-border pb-4 font-serif text-xl text-primary">Order Summary</h2>
          <div className="max-h-72 space-y-4 overflow-y-auto">
            {checkoutCart.map(item => (
              <div key={item.id} className="flex gap-3">
                <img src={item.image} alt={item.name} className="h-16 w-14 rounded-sm object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-primary">{item.name}</p>
                  <p className="text-xs text-muted-foreground">Qty {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold text-primary">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 space-y-3 border-t border-border pt-5 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="text-green-700">Free</span></div>
            <div className="flex justify-between border-t border-border pt-4 text-lg font-semibold text-primary"><span>Total</span><span>{formatPrice(total)}</span></div>
          </div>
          {error && <p className="mt-4 rounded-sm border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <button type="submit" disabled={isProcessing} className="mt-6 w-full rounded-sm bg-primary py-4 text-sm font-semibold uppercase tracking-widest text-primary-foreground transition hover:bg-gold disabled:cursor-wait disabled:opacity-60">
            {isProcessing ? "Processing..." : paymentMethod === "cod" ? "Place Order" : "Pay Securely"}
          </button>
        </aside>
      </form>
    </div>
  );
}
